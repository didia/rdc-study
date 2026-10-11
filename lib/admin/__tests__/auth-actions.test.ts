import {beforeEach, describe, expect, it, vi} from 'vitest';

const state = vi.hoisted(() => ({
  user: {id: 'user-1'} as {id: string} | null,
  aal: {currentLevel: 'aal1', nextLevel: 'aal1'} as {currentLevel: string; nextLevel: string},
  updateUser: vi.fn(async (_attrs: unknown) => ({error: null as unknown})),
  invite: vi.fn(),
  insert: vi.fn(),
  existingProfile: null as unknown,
  deleteUser: vi.fn(async (_id: string) => ({})),
}));

class Redirect extends Error {}

vi.mock('next/navigation', () => ({
  redirect: (to: string) => {
    throw new Redirect(to);
  },
}));
vi.mock('next/cache', () => ({revalidatePath: vi.fn()}));
vi.mock('../env', () => ({isAdminConfigured: () => true}));
vi.mock('../origin', () => ({getRequestOrigin: async () => 'https://admin.test'}));
vi.mock('../auth', () => ({requireStaff: vi.fn(async () => ({}))}));
vi.mock('../db/server', () => ({
  createSupabaseServerClient: async () => ({
    auth: {
      getUser: async () => ({data: {user: state.user}}),
      updateUser: state.updateUser,
      mfa: {getAuthenticatorAssuranceLevel: async () => ({data: state.aal})},
    },
  }),
  createSupabaseServiceClient: () => ({
    auth: {admin: {inviteUserByEmail: state.invite, deleteUser: state.deleteUser}},
    from: () => ({
      insert: state.insert,
      select: () => ({eq: () => ({maybeSingle: async () => ({data: state.existingProfile})})}),
    }),
  }),
}));

import {inviteStaff, updatePassword} from '../actions/auth';

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [k, v] of Object.entries(values)) data.set(k, v);
  return data;
}

async function redirectTarget(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (e) {
    if (e instanceof Redirect) return e.message;
    throw e;
  }
  return undefined;
}

describe('updatePassword', () => {
  const password = 'a-long-enough-password';
  beforeEach(() => {
    state.user = {id: 'user-1'};
    state.aal = {currentLevel: 'aal1', nextLevel: 'aal1'};
    state.updateUser.mockClear();
  });

  it('sends a recovery session with a verified factor through the MFA challenge first', async () => {
    state.aal = {currentLevel: 'aal1', nextLevel: 'aal2'};
    const target = await redirectTarget(updatePassword(undefined, form({password, confirm: password})));
    expect(target).toBe('/admin/mfa?next=%2Fadmin%2Fmot-de-passe');
    expect(state.updateUser).not.toHaveBeenCalled();
  });

  it('updates the password once the session is aal2', async () => {
    state.aal = {currentLevel: 'aal2', nextLevel: 'aal2'};
    expect(await redirectTarget(updatePassword(undefined, form({password, confirm: password})))).toBe('/admin');
    expect(state.updateUser).toHaveBeenCalledWith({password});
  });

  it('updates the password for staff who have not enrolled a factor', async () => {
    expect(await redirectTarget(updatePassword(undefined, form({password, confirm: password})))).toBe('/admin');
    expect(state.updateUser).toHaveBeenCalledTimes(1);
  });
});

describe('inviteStaff', () => {
  const values = {email: 'new@rdcetudes.com', fullName: 'New Person', role: 'viewer'};
  const freshUser = () => ({id: 'user-2', created_at: new Date().toISOString()});
  const oldUser = () => ({id: 'user-2', created_at: new Date(Date.now() - 3 * 86_400_000).toISOString()});

  beforeEach(() => {
    state.invite.mockReset();
    state.insert.mockReset();
    state.deleteUser.mockClear();
    state.existingProfile = null;
  });

  it('creates the profile for a new invitation', async () => {
    state.invite.mockResolvedValue({data: {user: freshUser()}, error: null});
    state.insert.mockResolvedValue({error: null});
    const result = await inviteStaff(undefined, form(values));
    expect(result?.success).toBeTruthy();
    expect(state.deleteUser).not.toHaveBeenCalled();
  });

  it('resending a pending invitation keeps the existing account', async () => {
    state.invite.mockResolvedValue({data: {user: oldUser()}, error: null});
    state.insert.mockResolvedValue({error: {code: '23505'}});
    const result = await inviteStaff(undefined, form(values));
    expect(result?.success).toBeTruthy();
    expect(state.deleteUser).not.toHaveBeenCalled();
  });

  it('does not delete a pre-existing account when the profile insert fails otherwise', async () => {
    state.invite.mockResolvedValue({data: {user: oldUser()}, error: null});
    state.insert.mockResolvedValue({error: {code: '40001'}});
    const result = await inviteStaff(undefined, form(values));
    expect(result?.error).toBeTruthy();
    expect(state.deleteUser).not.toHaveBeenCalled();
  });

  it('rolls back an account created by this very invitation', async () => {
    state.invite.mockResolvedValue({data: {user: freshUser()}, error: null});
    state.insert.mockResolvedValue({error: {code: '40001'}});
    const result = await inviteStaff(undefined, form(values));
    expect(result?.error).toBeTruthy();
    expect(state.deleteUser).toHaveBeenCalledWith('user-2');
  });

  it('keeps the account when a concurrent invitation created the profile meanwhile', async () => {
    state.invite.mockResolvedValue({data: {user: freshUser()}, error: null});
    state.insert.mockResolvedValue({error: {code: '40001'}});
    state.existingProfile = {id: 'user-2'};
    const result = await inviteStaff(undefined, form(values));
    expect(result?.success).toBeTruthy();
    expect(state.deleteUser).not.toHaveBeenCalled();
  });
});

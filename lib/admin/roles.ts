import type {Database} from './db/types';

export type StaffRole = Database['public']['Enums']['staff_role'];

export const STAFF_ROLES: StaffRole[] = ['admin', 'agent', 'mentor', 'viewer'];

export const ROLE_LABELS: Record<StaffRole, string> = {
  admin: 'Administrateur',
  agent: 'Agent',
  mentor: 'Mentor',
  viewer: 'Lecteur',
};

// Higher rank = more rights. `mentor` ranks with `viewer` until Phase 3 gives it scoped access.
const RANK: Record<StaffRole, number> = {admin: 3, agent: 2, viewer: 1, mentor: 1};

export function hasRole(role: StaffRole | null | undefined, minimum: StaffRole): boolean {
  return !!role && RANK[role] >= RANK[minimum];
}

export const canEdit = (role: StaffRole | null | undefined) => hasRole(role, 'agent');
export const isAdmin = (role: StaffRole | null | undefined) => role === 'admin';

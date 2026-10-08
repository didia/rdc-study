import {describe, expect, it} from 'vitest';

import {canEdit, hasRole, isAdmin} from '../roles';

describe('roles', () => {
  it('ranks admin > agent > viewer', () => {
    expect(hasRole('admin', 'agent')).toBe(true);
    expect(hasRole('agent', 'agent')).toBe(true);
    expect(hasRole('viewer', 'agent')).toBe(false);
    expect(hasRole('agent', 'admin')).toBe(false);
  });

  it('never grants anything to a missing role', () => {
    expect(hasRole(null, 'viewer')).toBe(false);
    expect(hasRole(undefined, 'viewer')).toBe(false);
    expect(canEdit(null)).toBe(false);
  });

  it('keeps mentors read-only until Phase 3', () => {
    expect(hasRole('mentor', 'viewer')).toBe(true);
    expect(canEdit('mentor')).toBe(false);
  });

  it('only admins are admins', () => {
    expect(isAdmin('admin')).toBe(true);
    expect(isAdmin('agent')).toBe(false);
  });
});

import {describe, expect, it} from 'vitest';

import {isAllowedStaffEmail} from '../staff-email';

describe('isAllowedStaffEmail', () => {
  it('allows everything when no domain list is configured', () => {
    expect(isAllowedStaffEmail('a@anything.org', undefined)).toBe(true);
    expect(isAllowedStaffEmail('a@anything.org', '')).toBe(true);
  });

  it('restricts to the configured domains, case-insensitively', () => {
    const domains = 'rdcetudes.com, Gmail.com';
    expect(isAllowedStaffEmail('Agent@RDCEtudes.com', domains)).toBe(true);
    expect(isAllowedStaffEmail('someone@gmail.com', domains)).toBe(true);
    expect(isAllowedStaffEmail('x@evil.com', domains)).toBe(false);
    expect(isAllowedStaffEmail('x@sub.rdcetudes.com', domains)).toBe(false);
    expect(isAllowedStaffEmail('not-an-email', domains)).toBe(false);
  });
});

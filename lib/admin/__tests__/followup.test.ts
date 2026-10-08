import {describe, expect, it} from 'vitest';

import {
  addDays,
  cadenceFor,
  isOverdue,
  isWaitingTooLong,
  nextFollowUpOnStatusChange,
  relancesSinceLastStatusChange,
} from '../followup';

const now = Date.parse('2026-10-20T12:00:00Z');

describe('follow-up rules', () => {
  it('suggests a cadence only for statuses that have one', () => {
    expect(cadenceFor('contacted', now)?.toISOString()).toBe(addDays(now, 2).toISOString());
    expect(cadenceFor('awaiting_client', now)?.toISOString()).toBe(addDays(now, 5).toISOString());
    expect(cadenceFor('in_discussion', now)).toBeNull();
  });

  it('detects overdue follow-ups', () => {
    expect(isOverdue('2026-10-20T11:59:00Z', now)).toBe(true);
    expect(isOverdue('2026-10-21T00:00:00Z', now)).toBe(false);
    expect(isOverdue(null, now)).toBe(false);
  });

  it('uses per-status waiting thresholds', () => {
    expect(isWaitingTooLong('new', '2026-10-17T00:00:00Z', now)).toBe(true); // > 2 d
    expect(isWaitingTooLong('in_discussion', '2026-10-17T00:00:00Z', now)).toBe(false); // < 7 d
  });

  it('counts unanswered relances since the last status change', () => {
    const events = [
      {type: 'created', created_at: '2026-10-01T00:00:00Z'},
      {type: 'contact_attempt', created_at: '2026-10-02T00:00:00Z'},
      {type: 'status_change', created_at: '2026-10-03T00:00:00Z'},
      {type: 'contact_attempt', created_at: '2026-10-04T00:00:00Z'},
      {type: 'note', created_at: '2026-10-05T00:00:00Z'},
      {type: 'contact_attempt', created_at: '2026-10-06T00:00:00Z'},
    ];
    expect(relancesSinceLastStatusChange(events)).toBe(2);
    expect(relancesSinceLastStatusChange([])).toBe(0);
  });

  describe('nextFollowUpOnStatusChange', () => {
    it('clears the reminder for closed requests', () => {
      expect(nextFollowUpOnStatusChange('won', 'deposit_paid', 'auto', now)).toEqual({set: true, value: null});
      expect(nextFollowUpOnStatusChange('lost', 'lost_failed', '3', now)).toEqual({set: true, value: null});
    });
    it('honours an explicit choice', () => {
      expect(nextFollowUpOnStatusChange('open', 'contacted', 'none', now)).toEqual({set: true, value: null});
      expect(nextFollowUpOnStatusChange('open', 'in_discussion', '7', now)).toEqual({set: true, value: addDays(now, 7)});
    });
    it('falls back to the cadence, or leaves the reminder alone', () => {
      expect(nextFollowUpOnStatusChange('open', 'follow_up', 'auto', now)).toEqual({set: true, value: addDays(now, 3)});
      expect(nextFollowUpOnStatusChange('open', 'in_discussion', 'auto', now)).toEqual({set: false});
    });
  });
});

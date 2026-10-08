// Follow-up rules (constants on purpose: tweak here, no settings screen needed).

/** Suggested delay before the next contact once a request enters a status. */
export const CADENCE_DAYS: Record<string, number> = {
  contacted: 2,
  follow_up: 3,
  awaiting_client: 5,
  awaiting_payment: 3,
};

/** "En attente depuis > N jours": per-status thresholds on last activity (default 7). */
export const STALE_DAYS: Record<string, number> = {
  new: 2,
  contacted: 3,
  in_discussion: 7,
  awaiting_client: 7,
  follow_up: 5,
  office_visit: 7,
  awaiting_payment: 5,
};
export const DEFAULT_STALE_DAYS = 7;

/** After this many unanswered follow-ups the UI suggests "Sans suite". */
export const RELANCE_LIMIT = 3;

export const SNOOZE_CHOICES = [1, 3, 7] as const;

const DAY = 86_400_000;

export const addDays = (from: Date | number, days: number): Date => new Date(new Date(from).getTime() + days * DAY);

export function cadenceFor(status: string, now: Date | number = Date.now()): Date | null {
  const days = CADENCE_DAYS[status];
  return days ? addDays(now, days) : null;
}

export const staleAfterDays = (status: string) => STALE_DAYS[status] ?? DEFAULT_STALE_DAYS;

export function isOverdue(nextFollowUpAt: string | null, now: Date | number = Date.now()): boolean {
  return !!nextFollowUpAt && new Date(nextFollowUpAt).getTime() <= new Date(now).getTime();
}

export function isWaitingTooLong(status: string, lastActivityAt: string, now: Date | number = Date.now()): boolean {
  return new Date(now).getTime() - new Date(lastActivityAt).getTime() > staleAfterDays(status) * DAY;
}

/** Unanswered follow-ups: contact attempts logged since the last status change. */
export function relancesSinceLastStatusChange(events: {type: string; created_at: string}[]): number {
  const sorted = [...events].sort((a, b) => b.created_at.localeCompare(a.created_at));
  let count = 0;
  for (const event of sorted) {
    if (event.type === 'status_change') break;
    if (event.type === 'contact_attempt') count += 1;
  }
  return count;
}

/**
 * What `next_follow_up_at` becomes when the status changes.
 * - `choice` 'auto': cadence for open statuses that have one, cleared for closed ones, untouched otherwise;
 * - 'none': cleared; a number: that many days from now.
 */
export function nextFollowUpOnStatusChange(
  stage: string | undefined,
  toStatus: string,
  choice: string,
  now: Date | number = Date.now(),
): {set: true; value: Date | null} | {set: false} {
  if (stage === 'won' || stage === 'lost') return {set: true, value: null};
  if (choice === 'none') return {set: true, value: null};
  if (/^\d+$/.test(choice)) return {set: true, value: addDays(now, Number(choice))};
  const cadence = cadenceFor(toStatus, now);
  return cadence ? {set: true, value: cadence} : {set: false};
}

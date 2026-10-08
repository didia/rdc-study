import {describe, expect, it} from 'vitest';

import {checklistFor, progress, toggled} from '../checklist';

describe('delivery checklist', () => {
  it('falls back to defaults by package kind', () => {
    expect(checklistFor('canada/visa').map((i) => i.key)).toContain('soumettre_la_demande');
    expect(checklistFor('canada/caq')[0].label).toMatch(/CAQ/);
    expect(checklistFor(null).length).toBeGreaterThan(0);
  });

  it('uses the package services when the content defines them', () => {
    const items = checklistFor('canada/visa', ['Choisir un programme', 'Préparer la demande']);
    expect(items).toEqual([
      {key: 'choisir_un_programme', label: 'Choisir un programme'},
      {key: 'preparer_la_demande', label: 'Préparer la demande'},
    ]);
  });

  it('tracks progress and toggles without mutating', () => {
    const items = checklistFor('canada/caq');
    const first = toggled({}, items[0].key, true, 'mentor-1', new Date('2026-10-01T00:00:00Z'));
    expect(progress(items, first)).toEqual({done: 1, total: 4});
    const undone = toggled(first, items[0].key, false, 'mentor-1');
    expect(progress(items, undone).done).toBe(0);
    expect(first[items[0].key].done).toBe(true);
    expect(first[items[0].key].by).toBe('mentor-1');
  });
});

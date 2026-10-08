'use client';

import {t} from '@/lib/admin/i18n';

// Ticks every row checkbox of the surrounding form.
export function SelectAll() {
  return (
    <input
      type="checkbox"
      aria-label={t('admin.requests.select-all')}
      onChange={(event) => {
        const form = event.currentTarget.form;
        form?.querySelectorAll<HTMLInputElement>('input[name="ids"]').forEach((box) => {
          box.checked = event.currentTarget.checked;
        });
      }}
    />
  );
}

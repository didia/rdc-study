'use client';

import {useEffect, useRef} from 'react';

import {t} from '@/lib/admin/i18n';

// Ticks every row checkbox of the surrounding form (the current page only) and mirrors their state back.
export function SelectAll() {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const form = ref.current?.form;
    if (!form) return;
    const sync = () => {
      const boxes = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="ids"]'));
      const checked = boxes.filter((box) => box.checked).length;
      if (!ref.current) return;
      ref.current.checked = boxes.length > 0 && checked === boxes.length;
      ref.current.indeterminate = checked > 0 && checked < boxes.length;
    };
    form.addEventListener('change', sync);
    return () => form.removeEventListener('change', sync);
  }, []);

  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={t('admin.requests.select-all-page')}
      onChange={(event) => {
        const checked = event.currentTarget.checked;
        event.currentTarget.form?.querySelectorAll<HTMLInputElement>('input[name="ids"]').forEach((box) => {
          box.checked = checked;
        });
      }}
    />
  );
}

'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState, useTransition} from 'react';

import {moveRequestStatus} from '@/lib/admin/actions/requests';
import {t} from '@/lib/admin/i18n';
import styles from './admin.module.scss';

export type BoardCard = {
  id: string;
  reference: string;
  client: string;
  detail: string;
  assignee: string | null;
  status: string;
  lastActivityAt: string;
  updatedAt: string;
  ageLabel: string;
  stale: boolean;
};
// `total` and `oldest` describe every matching request of the column, not only the ones loaded on this page.
export type BoardColumn = {code: string; label: string; stage: string; color: string | null; total: number; oldest: string | null};

type Props = {
  columns: BoardColumn[];
  cards: BoardCard[];
  lostReasons: {code: string; label_fr: string}[];
  canEdit: boolean;
};

// Native drag & drop (no dependency). Every card also has a "Déplacer vers…" select, so the board is
// fully usable from the keyboard and on touch screens.
export function Board({columns, cards, lostReasons, canEdit}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [dragging, setDragging] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  // A move that needs an explanation first: a lost reason (entering a lost status) or a reopen reason (leaving one).
  const [ask, setAsk] = useState<{id: string; status: string; kind: 'lost' | 'reopen'} | null>(null);
  const stageOf = (code: string) => columns.find((c) => c.code === code)?.stage;

  function move(id: string, status: string, extra?: {lostReason?: string; reason?: string}) {
    const card = cards.find((c) => c.id === id);
    if (!card || card.status === status) return;
    const toStage = stageOf(status);
    if (toStage === 'lost' && !extra?.lostReason) {
      setAsk({id, status, kind: 'lost'});
      return;
    }
    if (toStage !== 'lost' && stageOf(card.status) === 'lost' && !extra?.reason) {
      setAsk({id, status, kind: 'reopen'});
      return;
    }
    setError(undefined);
    setAsk(null);
    startTransition(async () => {
      const result = await moveRequestStatus({id, status, updatedAt: card.updatedAt, ...extra});
      if (result.error) setError(result.error);
      router.refresh();
    });
  }

  return (
    <div>
      {error && <p className={styles.alertError} role="alert" style={{marginBottom: 12}}>{error}</p>}

      {ask && (
        <form
          className={styles.bulkBar}
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            if (ask.kind === 'lost') {
              const lostReason = String(data.get('lostReason') ?? '');
              if (lostReason) move(ask.id, ask.status, {lostReason});
            } else {
              const reason = String(data.get('reason') ?? '').trim();
              if (reason) move(ask.id, ask.status, {reason});
            }
          }}
        >
          {ask.kind === 'lost' ? (
            <>
              <strong>{t('admin.board.lost-reason')}</strong>
              <select name="lostReason" required defaultValue="" className={styles.select} aria-label={t('admin.requests.status.lost-reason')}>
                <option value="" disabled>—</option>
                {lostReasons.map((r) => (
                  <option key={r.code} value={r.code}>{r.label_fr}</option>
                ))}
              </select>
            </>
          ) : (
            <>
              <strong>{t('admin.board.reopen-reason')}</strong>
              <input name="reason" required className={styles.input} placeholder={t('admin.requests.status.reason')} aria-label={t('admin.board.reopen-reason')} />
            </>
          )}
          <button type="submit" className={styles.button}>{t('admin.board.confirm')}</button>
          <button type="button" className={styles.buttonSecondary} onClick={() => setAsk(null)}>{t('admin.board.cancel')}</button>
        </form>
      )}

      <div className={styles.board} aria-busy={pending}>
        {columns.map((column) => {
          const items = cards.filter((c) => c.status === column.code);
          return (
            <section
              key={column.code}
              className={styles.boardColumn}
              onDragOver={(e) => canEdit && e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (canEdit && dragging) move(dragging, column.code);
                setDragging(null);
              }}
              aria-label={column.label}
            >
              <header className={styles.boardHead} style={{borderTopColor: column.color ?? '#667085'}}>
                <strong>{column.label}</strong>
                <span className={styles.countMuted}>{column.total}</span>
                {column.oldest && <small className={styles.muted}>{t('admin.board.oldest', {age: column.oldest})}</small>}
              </header>
              {items.map((card) => (
                <article
                  key={card.id}
                  className={styles.boardCard}
                  draggable={canEdit}
                  onDragStart={() => setDragging(card.id)}
                  onDragEnd={() => setDragging(null)}
                  style={{opacity: dragging === card.id ? 0.5 : 1}}
                >
                  <Link href={`/admin/demandes/${card.id}`}>
                    <strong>{card.reference}</strong>
                  </Link>
                  <span>{card.client}</span>
                  <small className={styles.muted}>{card.detail}</small>
                  <small className={card.stale ? styles.stale : styles.muted}>
                    {card.ageLabel}
                    {card.assignee ? ` · ${card.assignee}` : ''}
                  </small>
                  {canEdit && (
                    <select
                      aria-label={t('admin.board.move', {reference: card.reference})}
                      value={card.status}
                      onChange={(e) => move(card.id, e.target.value)}
                      className={styles.select}
                    >
                      {columns.map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                  )}
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}

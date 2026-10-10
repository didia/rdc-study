'use client';

import * as Sentry from '@sentry/nextjs';
import {useEffect} from 'react';

export default function GlobalError({
  error,
}: {
  error: Error & {digest?: string};
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  // global-error replaces the root layout, so site CSS and next/link are unavailable: inline styles and a plain anchor.
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          background: '#f3f4f9',
          color: '#2e3141',
          fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
        }}
      >
        <main
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
          }}
        >
          <section
            style={{
              maxWidth: '36rem',
              padding: '40px 32px',
              border: '1px solid rgba(46, 49, 65, 0.14)',
              borderRadius: '18px',
              background: '#fff',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                marginTop: 0,
                color: '#2e3141',
                fontFamily: 'Raleway, Helvetica, sans-serif',
                fontSize: '1.75rem',
              }}
            >
              Une erreur est survenue
            </h1>
            <p>La page a rencontré un problème inattendu. Vous pouvez revenir à l&apos;accueil et réessayer.</p>
            <a
              href="/"
              style={{
                display: 'inline-block',
                marginTop: '8px',
                padding: '14px 28px',
                borderRadius: '4px',
                background: '#4c5c96',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Retour à l&apos;accueil
            </a>
          </section>
        </main>
      </body>
    </html>
  );
}

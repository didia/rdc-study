import styles from './admin.module.scss';

export function AuthCard({title, lead, children}: {title: string; lead?: string; children: React.ReactNode}) {
  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <span className={styles.brand}>RDC Études</span>
        <h1>{title}</h1>
        {lead && <p className={styles.lead}>{lead}</p>}
        {children}
      </section>
    </main>
  );
}

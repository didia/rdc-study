import {DocumentTemplateForm, TemplateForm} from '@/components/admin/SettingsForms';
import styles from '@/components/admin/admin.module.scss';
import {requireStaff} from '@/lib/admin/auth';
import {t} from '@/lib/admin/i18n';
import {getTemplates} from '@/lib/admin/queries/today';
import {PLACEHOLDERS} from '@/lib/admin/templates';

export default async function TemplatesPage() {
  const {supabase} = await requireStaff('admin');
  const templates = await getTemplates(supabase, true);
  const {data: docTemplates} = await supabase.from('document_templates').select('*').order('version', {ascending: false});
  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.templates.title')}</h1>
      </div>
      <p className={styles.muted} style={{marginBottom: 16}}>
        {t('admin.templates.lead')} {PLACEHOLDERS.map((p) => `{{${p}}}`).join(' ')}
      </p>
      {templates.map((tpl) => (
        <section key={tpl.id} className={styles.card}>
          <TemplateForm template={tpl} />
        </section>
      ))}
      <section className={styles.card}>
        <h2>{t('admin.templates.new')}</h2>
        <TemplateForm />
      </section>
      <section className={styles.card}>
        <h2>{t('admin.templates.documents')}</h2>
        <p className={styles.muted} style={{marginBottom: 12}}>{t('admin.templates.documents-lead')}</p>
        {(['contract', 'receipt'] as const).map((kind) => {
          const latest = (docTemplates ?? []).find((d) => d.kind === kind);
          return latest ? <DocumentTemplateForm key={kind} template={latest} /> : null;
        })}
      </section>
    </>
  );
}

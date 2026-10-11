import {AuthCard} from '@/components/admin/AuthCard';
import {ForgotPasswordForm} from '@/components/admin/AuthForms';
import {t} from '@/lib/admin/i18n';

export default function ForgotPasswordPage() {
  return (
    <AuthCard title={t('admin.auth.forgot-title')} lead={t('admin.auth.forgot-lead')}>
      <ForgotPasswordForm />
    </AuthCard>
  );
}

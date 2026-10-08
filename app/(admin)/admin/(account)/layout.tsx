import {Shell} from '@/components/admin/Shell';
import {requireStaff} from '@/lib/admin/auth';

// Account pages stay reachable while the second factor is still to be set up (otherwise nobody could enrol).
export default async function AccountLayout({children}: {children: React.ReactNode}) {
  const {profile} = await requireStaff('viewer', {allowMfaSetup: true});
  return <Shell profile={profile}>{children}</Shell>;
}

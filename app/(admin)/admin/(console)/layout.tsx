import {Shell} from '@/components/admin/Shell';
import {requireStaff} from '@/lib/admin/auth';

export default async function ConsoleLayout({children}: {children: React.ReactNode}) {
  const {profile} = await requireStaff();
  return <Shell profile={profile}>{children}</Shell>;
}

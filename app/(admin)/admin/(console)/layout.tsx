import {Shell} from '@/components/admin/Shell';
import {requireStaff} from '@/lib/admin/auth';
import {getStatuses} from '@/lib/admin/queries/requests';
import {overdueBadgeCount} from '@/lib/admin/queries/today';

export default async function ConsoleLayout({children}: {children: React.ReactNode}) {
  const {profile, supabase, user} = await requireStaff();
  const statuses = await getStatuses(supabase);
  const overdue = await overdueBadgeCount(
    supabase,
    user.id,
    statuses.filter((s) => s.stage === 'open').map((s) => s.code),
  );
  return (
    <Shell profile={profile} overdue={overdue}>
      {children}
    </Shell>
  );
}

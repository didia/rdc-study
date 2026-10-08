import {redirect} from 'next/navigation';

// The requests list is the console's home.
export default function AdminHomePage() {
  redirect('/admin/demandes');
}

import { getSession } from '@/lib/auth';
import LoginForm from './client-components';
import { redirect } from 'next/navigation';
import { loginUser } from '@/app/actions';

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect('/');
  }

  return (
    <main className="flex flex-col p-4">
      <LoginForm loginUser={loginUser} />
    </main>
  );
}

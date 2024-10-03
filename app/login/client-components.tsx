'use client';

import { useContext, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { IconSpinner } from '../../components/ui/icons';
import { useRouter } from 'next/navigation';
import { SocketContext } from '@/context/Socket';

export default function LoginForm({ loginUser }: { loginUser(formData: FormData): Promise<string> }) {
  const router = useRouter();
  const { socket } = useContext(SocketContext);
  const [isPending, startTransition] = useTransition();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setLoading(true);
    startTransition(() => {
      loginUser(formData)
        .then(token => {
          toast.success('Logged in!');
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('token', token);
          }

          socket?.connect();

          router.push('/');
        })
        .catch(() => {
          toast.error('Invalid credentials');
        })
        .finally(() => setLoading(false));
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate={false} className="flex flex-col items-center gap-4 space-y-3">
      <div className="w-full flex-1 rounded-lg border bg-white px-6 pb-4 pt-8 shadow-md md:w-[500px] dark:bg-zinc-950">
        <h1 className="mb-3 text-2xl font-bold">Please log in to continue.</h1>
        <div className="w-full">
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-zinc-400" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-3 mt-5 block text-xs font-medium text-zinc-400" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>

        <div className="w-full mt-4 pt-4">
          <button
            className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            aria-disabled={loading || isPending}
            type="submit"
            disabled={loading || isPending}
          >
            {loading || isPending ? <IconSpinner /> : 'Log in'}
          </button>
        </div>
      </div>
    </form>
  );
}

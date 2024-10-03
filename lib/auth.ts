import { cookies } from 'next/headers';
import { SessionPayload } from '@/lib/types';

export async function encrypt(payload: SessionPayload) {
  return payload ? JSON.stringify(payload) : '';
}

export async function decrypt(payload: string): Promise<SessionPayload> {
  return JSON.parse(payload);
}

export async function login({ user, accessToken }: { user: any; accessToken: string }) {
  const expires = new Date(Date.now() + 20 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires, accessToken });

  cookies().set('session', session, { expires, httpOnly: true });
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;

  return await decrypt(session);
}

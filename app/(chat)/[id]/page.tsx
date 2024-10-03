import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Chat } from './client-components';
import { sendText, getInitialMessages } from '@/app/actions';

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const session = await getSession();

  if (!session?.user) {
    return {};
  }

  return {
    title: 'Chat',
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await getSession();

  if (!session?.user) {
    redirect(`/login?next=/${params.id}`);
  }

  const messages = await getInitialMessages(params.id);

  return <Chat id={params.id} sendText={sendText} initialMessages={messages} user={session?.user} />;
}

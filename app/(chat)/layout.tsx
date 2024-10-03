import { SidebarDesktop } from '@/components/sidebar-desktop';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }
  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
      <SidebarDesktop />
      {children}
    </div>
  );
}

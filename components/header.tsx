import * as React from 'react';
import Link from 'next/link';

import { getSession } from '@/lib/auth';
import { IconNextChat, IconSeparator } from '@/components/ui/icons';
import { UserMenu } from '@/components/user-menu';
import { SidebarMobile } from './sidebar-mobile';
import { SidebarToggle } from './sidebar-toggle';
import { ChatHistory } from './chat-history';

async function UserOrLogin() {
  const session = await getSession();

  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/" rel="nofollow">
          <IconNextChat className="size-6 mr-2 dark:hidden" inverted />
          <IconNextChat className="hidden size-6 mr-2 dark:block" />
        </Link>
      )}
      {session?.user && (
        <div className="flex items-center">
          <IconSeparator className="size-6 text-muted-foreground/50" />
          <UserMenu user={session.user} />
        </div>
      )}
    </>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
    </header>
  );
}

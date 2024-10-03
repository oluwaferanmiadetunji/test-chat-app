'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { buttonVariants } from '@/components/ui/button';
import type { User } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  user: User;
}

export function SidebarItem({ user }: SidebarItemProps) {
  const pathname = usePathname();

  const isActive = pathname === `/${user.id}`;

  if (!user?.id) return null;

  return (
    <motion.div
      className="relative h-8"
      variants={{
        initial: {
          height: 0,
          opacity: 0,
        },
        animate: {
          height: 'auto',
          opacity: 1,
        },
      }}
      initial={undefined}
      animate={undefined}
      transition={{
        duration: 0.25,
        ease: 'easeIn',
      }}
    >
      <a
        href={user.id}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'group w-full px-8 transition-colors hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10',
          isActive && 'bg-zinc-200 pr-16 font-semibold dark:bg-zinc-800'
        )}
      >
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all flex gap-4"
          title={user.name}
        >
          <span className={`${isActive ? 'text-green-600' : 'text-white'} bold hover:text-green-600`}>{user.name}</span>
        </div>
      </a>
    </motion.div>
  );
}

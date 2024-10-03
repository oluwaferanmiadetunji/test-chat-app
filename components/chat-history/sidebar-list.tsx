import { getUsers } from '@/app/actions';
import { cache } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SidebarItem } from './sidebar-item';
import * as React from 'react';
import { getSession } from '@/lib/auth';

const loadUsers = cache(async () => {
  return await getUsers();
});

export async function SidebarList() {
  const users = await loadUsers();
  const session = await getSession();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {users?.length ? (
          <div className="space-y-2 px-2">
            <AnimatePresence>
              {users
                .filter(user => user.id !== session?.user?.id)
                .map(user => (
                  <SidebarItem user={user} key={user.id} />
                ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No users</p>
          </div>
        )}
      </div>
    </div>
  );
}

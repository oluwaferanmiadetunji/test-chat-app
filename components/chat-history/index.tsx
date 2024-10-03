import * as React from 'react';
import { SidebarList } from './sidebar-list';

export async function ChatHistory() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center p-4"></div>

      <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
        }
      >
        <SidebarList />
      </React.Suspense>
    </div>
  );
}

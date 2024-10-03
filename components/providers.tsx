'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { SidebarProvider } from '@/lib/hooks/use-sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SocketContextProvider } from '@/context/Socket';

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <SocketContextProvider>
        <SidebarProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SidebarProvider>
      </SocketContextProvider>
    </NextThemesProvider>
  );
}

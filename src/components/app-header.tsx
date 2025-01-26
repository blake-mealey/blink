'use client';

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  setClientSitePreference,
  useColorScheme,
} from '@/lib/color-scheme/client';

export function AppHeader({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex items-center justify-between gap-2 flex-1">
        <div>{children}</div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {scheme === 'dark' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem onClick={() => setClientSitePreference('dark')}>
                <MoonIcon /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setClientSitePreference('light')}
              >
                <SunIcon />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setClientSitePreference('system')}
              >
                <MonitorIcon /> System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

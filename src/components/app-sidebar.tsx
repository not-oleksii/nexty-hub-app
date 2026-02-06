'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { CirclePlusIcon, ListVideoIcon, LogOutIcon, User2 } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/constants/routes';

export function AppSidebar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      const res = await fetch('/api/logout', { method: 'POST' });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      router.push(ROUTES.login);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';

      setLogoutError(message);
    } finally {
      setIsLoggingOut(false);
    }
  }, [router]);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href={ROUTES.discoverList.root}>
                  <ListVideoIcon size={24} className="text-primary" />
                  Discovery List
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href={ROUTES.discoverList.add}>
                  <CirclePlusIcon size={24} className="text-primary" /> Add New
                  Item
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User2 /> Username
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton disabled={isLoggingOut} onClick={handleLogout}>
              <LogOutIcon /> {isLoggingOut ? 'Logging out...' : 'Logout'}
            </SidebarMenuButton>
          </SidebarMenuItem>
          {logoutError ? (
            <SidebarMenuItem>
              <SidebarMenuButton aria-disabled>{logoutError}</SidebarMenuButton>
            </SidebarMenuItem>
          ) : null}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

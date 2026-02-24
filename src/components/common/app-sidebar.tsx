'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BookmarkIcon,
  CirclePlusIcon,
  DicesIcon,
  ListVideoIcon,
  LogOutIcon,
  User2,
} from 'lucide-react';

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
import { getErrorMessage } from '@/lib/utils/common';
import { authMutations } from '@/server/api/queries/auth.queries';
import { clearSessionCache } from '@/server/api/queries/session-cache';
import { usersQueries } from '@/server/api/queries/users.queries';

const MenuItemWithLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive>
        <Link href={href}>{children}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutMutation = useMutation(authMutations.logout());
  const userQuery = useQuery(usersQueries.current());

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();

      clearSessionCache(queryClient);

      router.push(ROUTES.login);
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [logoutMutation, queryClient, router]);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <MenuItemWithLink href={ROUTES.discover.root}>
              <ListVideoIcon size={24} className="text-primary" />
              Discover
            </MenuItemWithLink>
            <MenuItemWithLink href={ROUTES.discover.add}>
              <CirclePlusIcon size={24} className="text-primary" /> Add New Item
            </MenuItemWithLink>
            <MenuItemWithLink href={ROUTES.lists.root}>
              <BookmarkIcon size={24} className="text-primary" /> Lists
            </MenuItemWithLink>
            <MenuItemWithLink href={ROUTES.randomPick.root}>
              <DicesIcon size={24} className="text-primary" /> Random Pick
            </MenuItemWithLink>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="cursor-pointer">
              <User2 /> {userQuery.data?.username}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              disabled={logoutMutation.isPending}
              onClick={handleLogout}
            >
              <LogOutIcon />
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </SidebarMenuButton>
          </SidebarMenuItem>
          {userQuery.isError ||
            (logoutMutation.isError && (
              <SidebarMenuItem>
                <SidebarMenuButton aria-disabled>
                  {getErrorMessage([userQuery.error, logoutMutation.error])}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  BookmarkIcon,
  CirclePlusIcon,
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
import { authMutations } from '@/server/api/queries/auth.queries';
import { usersQueries } from '@/server/api/queries/users.queries';
import { getErrorMessage } from '@/lib/utils/common';

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
  const {
    mutateAsync: logoutAsync,
    isPending: isLogoutPending,
    error: logoutError,
    isError: isLogoutError,
  } = useMutation(authMutations.logout());
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useQuery(usersQueries.current());

  console.log(user);

  const handleLogout = useCallback(async () => {
    try {
      await logoutAsync();

      router.push(ROUTES.login);
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [logoutAsync, router]);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <MenuItemWithLink href={ROUTES.discoverList.root}>
              <ListVideoIcon size={24} className="text-primary" />
              Discovery List
            </MenuItemWithLink>
            <MenuItemWithLink href={ROUTES.discoverList.add}>
              <CirclePlusIcon size={24} className="text-primary" /> Add New Item
            </MenuItemWithLink>
            <MenuItemWithLink href={ROUTES.lists.root}>
              <BookmarkIcon size={24} className="text-primary" /> Lists
            </MenuItemWithLink>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="cursor-pointer">
              <User2 /> {user?.username}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              disabled={isLogoutPending}
              onClick={handleLogout}
            >
              <LogOutIcon /> {isLogoutPending ? 'Logging out...' : 'Logout'}
            </SidebarMenuButton>
          </SidebarMenuItem>
          {isUserError ||
            (isLogoutError && (
              <SidebarMenuItem>
                <SidebarMenuButton aria-disabled>
                  {getErrorMessage([logoutError, userError])}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

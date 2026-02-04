import { AppSidebar } from '@/components/app-sidebar';
import { ContentWrapper } from '@/components/layout/content';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

type AuthorizedLayoutProps = {
  children: React.ReactNode;
};

export default function AuthorizedLayout({ children }: AuthorizedLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '12rem',
          '--sidebar-width-mobile': '20rem',
        } as React.CSSProperties & Record<string, string>
      }
    >
      <AppSidebar />

      <SidebarInset className="min-h-svh">
        <header className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
        </header>

        <ContentWrapper className="mx-auto w-full max-w-7xl px-4 md:px-6">
          {children}
        </ContentWrapper>
      </SidebarInset>
    </SidebarProvider>
  );
}

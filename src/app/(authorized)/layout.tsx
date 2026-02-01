import { AppSidebar } from '@/components/app-sidebar';
import { ContentWrapper } from '@/components/layout/content';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

type AuthorizedLayoutProps = {
  children: React.ReactNode;
};

export default function AuthorizedLayout({ children }: AuthorizedLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <ContentWrapper className="mx-20 max-w-7xl">{children}</ContentWrapper>
      </main>
    </SidebarProvider>
  );
}

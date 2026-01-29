import { ContentWrapper } from '@/components/layout/content';

type AuthorizedLayoutProps = {
  children: React.ReactNode;
};

export default function AuthorizedLayout({ children }: AuthorizedLayoutProps) {
  return <ContentWrapper>{children}</ContentWrapper>;
}

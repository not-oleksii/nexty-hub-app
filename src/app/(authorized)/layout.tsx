import { ContentWrapper } from '@/components/layout/content';

type AuthorizedLayoutProps = {
  children: React.ReactNode;
};

export default function AuthorizedLayout({ children }: AuthorizedLayoutProps) {
  return <ContentWrapper className="max-w-7xl">{children}</ContentWrapper>;
}

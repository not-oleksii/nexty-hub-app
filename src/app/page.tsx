import Link from 'next/link';

import { ContentWrapper } from '@/components/layout/content';
import { ROUTES } from '@/constants/routes';

export default function Home() {
  return (
    <ContentWrapper>
      <Link href={ROUTES.discoverList.root}>Discover List</Link>
    </ContentWrapper>
  );
}

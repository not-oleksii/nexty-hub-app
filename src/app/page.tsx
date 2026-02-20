import Link from 'next/link';

import { SparkleIcon } from 'lucide-react';

import { ContentWrapper } from '@/components/layout/content';
import { Caption } from '@/components/typography/caption';
import { Header } from '@/components/typography/header';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function Home() {
  return (
    <ContentWrapper className="flex items-center justify-center">
      <div className="mt-64 flex h-full flex-col gap-3">
        <div className="flex items-center justify-center gap-2">
          <Header className="flex items-center gap-2">
            Welcome to Nexty Hub!
            <SparkleIcon
              className="text-primary hidden sm:block"
              fill="currentColor"
            />
          </Header>
        </div>
        <Caption className="max-w-lg text-center">
          Nexty Hub is a platform for discovering, picking and tracking your
          favorite movies, series, games, books, courses, and other items.
        </Caption>
        <div className="mt-4 flex justify-center">
          <Button className="w-full md:w-auto">
            <Link href={ROUTES.login}>Get Started!</Link>
          </Button>
        </div>
      </div>
    </ContentWrapper>
  );
}

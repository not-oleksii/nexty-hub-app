import Link from 'next/link';

import { SparkleIcon } from 'lucide-react';

import { ContentWrapper } from '@/components/layout/content';
import { Caption1 } from '@/components/typography/caption1';
import { Header1 } from '@/components/typography/header1';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function Home() {
  return (
    <ContentWrapper className="flex items-center justify-center">
      <div className="mt-64 flex h-full flex-col gap-3">
        <div className="flex items-center justify-center gap-2">
          <Header1 className="flex items-center gap-2">
            Welcome to Nexty Hub!
            <SparkleIcon
              className="text-primary hidden sm:block"
              fill="currentColor"
            />
          </Header1>
        </div>
        <Caption1 className="max-w-lg text-center">
          Nexty Hub is a platform for discovering, picking and tracking your
          favorite movies, series, games, books, courses, and other items.
        </Caption1>
        <div className="mt-4 flex justify-center">
          <Button className="w-full md:w-auto">
            <Link href={ROUTES.login}>Get Started!</Link>
          </Button>
        </div>
      </div>
    </ContentWrapper>
  );
}

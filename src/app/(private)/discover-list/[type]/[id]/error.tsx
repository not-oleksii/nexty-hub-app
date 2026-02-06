'use client';

import Link from 'next/link';

import { ArrowLeftIcon } from 'lucide-react';

import { ContentWrapper } from '@/components/layout/content';
import { Caption1 } from '@/components/typography/caption1';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function DiscoverItemPageError() {
  return (
    <ContentWrapper>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Caption1>
            The item you are looking for not found. Try another one.
          </Caption1>
        </div>
        <Link href={ROUTES.discoverList.root}>
          <Button>
            <ArrowLeftIcon data-icon="inline-left" />
            Go back to the Discover List
          </Button>
        </Link>
      </div>
    </ContentWrapper>
  );
}

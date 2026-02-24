'use client';

import Link from 'next/link';

import { ArrowLeftIcon } from 'lucide-react';

import { ContentWrapper } from '@/components/layout/content';
import { Caption } from '@/components/typography/caption';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function DiscoverItemPageError() {
  return (
    <ContentWrapper>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Caption>
            The item you are looking for not found. Try another one.
          </Caption>
        </div>
        <Link href={ROUTES.discover.root}>
          <Button>
            <ArrowLeftIcon data-icon="inline-left" />
            Go back to the Discover List
          </Button>
        </Link>
      </div>
    </ContentWrapper>
  );
}

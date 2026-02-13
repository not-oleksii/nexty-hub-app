import { NextResponse } from 'next/server';

import { DiscoverItemType } from '@generated/prisma/enums';

import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { getDiscoverItemsByType } from '@/server/lib/discover';

type Params = {
  params: Promise<{ type: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const { type } = await params;
    const { data, status } = await getDiscoverItemsByType(
      type as DiscoverItemType,
    );

    return NextResponse.json(data ?? [], { status });
  } catch (error: unknown) {
    console.error('Error fetching discover items:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}

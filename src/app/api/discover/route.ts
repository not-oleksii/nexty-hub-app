import { NextResponse } from 'next/server';

import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { getDiscoverItems } from '@/server/lib/discover';

export async function GET() {
  try {
    const { data, status } = await getDiscoverItems();

    return NextResponse.json(data ?? [], { status });
  } catch (error: unknown) {
    console.error('Error fetching discover items:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}

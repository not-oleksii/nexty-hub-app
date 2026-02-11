import { NextResponse } from 'next/server';

import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { getDiscoverItemById } from '@/server/lib/discover';

type Params = {
  params: Promise<{ type: string; id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { data, status, error } = await getDiscoverItemById(id);

    if (error) {
      return NextResponse.json({ error }, { status });
    }

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    console.error('Error fetching discover item:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}

import { NextResponse } from 'next/server';

import { type DiscoverItemSchema } from '@/lib/validators/discovery-item';
import { ApiErrorType, HttpStatus } from '@/server/http/types';
import { createDiscoverItem } from '@/server/lib/discover';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as DiscoverItemSchema;
    const { data, status, message, error } = await createDiscoverItem(body);

    if (error) {
      return NextResponse.json({ error: message }, { status: status });
    }

    return NextResponse.json(data, { status });
  } catch (err: unknown) {
    console.error('Error creating item:', err);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}

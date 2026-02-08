import { NextResponse } from 'next/server';

import { prisma } from '@/server/db/prisma';

import { ApiErrorType } from '../error-types';

export async function GET() {
  try {
    const items = await prisma.discoverItem.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ items });
  } catch (error: unknown) {
    console.error('Error fetching discover items:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}

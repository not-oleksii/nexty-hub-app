import { NextResponse } from 'next/server';

import { prisma } from '@/server/db/prisma';
import { mapItemTypeToPrisma } from '@/server/lib/utils';

import { ApiErrorType } from '../../error-types';

type Params = {
  params: Promise<{ type: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const { type } = await params;

    const prismaType = mapItemTypeToPrisma(type);

    const items = await prisma.discoverItem.findMany({
      where: { type: prismaType },
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

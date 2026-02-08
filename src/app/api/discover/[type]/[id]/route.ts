import { NextResponse } from 'next/server';

import { ApiErrorType } from '@/app/api/error-types';
import { prisma } from '@/server/db/prisma';
import { mapItemTypeToPrisma } from '@/server/lib/utils';

type Params = {
  params: Promise<{ type: string; id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const { type, id } = await params;

    const prismaType = mapItemTypeToPrisma(type);

    const item = await prisma.discoverItem.findUnique({
      where: { type: prismaType, id },
    });

    return NextResponse.json({ item });
  } catch (error: unknown) {
    console.error('Error fetching discover item:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}

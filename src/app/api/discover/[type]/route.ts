import { NextResponse } from 'next/server';

import { prisma } from '@/server/db/prisma';
import { mapItemTypeToPrisma } from '@/server/lib/utils';

type Params = {
  params: Promise<{ type: string }>;
};

export async function GET(request: Request, { params }: Params) {
  const { type } = await params;
  const { searchParams } = new URL(request.url);
  const isRandom = searchParams.get('random') === 'true';

  const prismaType = mapItemTypeToPrisma(type);

  if (isRandom) {
    const count = await prisma.discoverItem.count({
      where: { type: prismaType },
    });

    if (count === 0) {
      return NextResponse.json(
        { error: 'No items found for this type' },
        { status: 404 },
      );
    }

    const item = await prisma.discoverItem.findFirst({
      where: { type: prismaType },
      skip: Math.floor(Math.random() * count),
      take: 1,
    });

    return NextResponse.json({ item });
  }

  const items = await prisma.discoverItem.findMany({
    where: { type: prismaType },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ items });
}

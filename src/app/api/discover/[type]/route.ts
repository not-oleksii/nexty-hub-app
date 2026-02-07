import { NextResponse } from 'next/server';

import { ItemType } from '@generated/prisma/enums';

import { prisma } from '@/server/db/prisma';
import { mapItemTypeToPrisma } from '@/server/lib/utils';

type Params = {
  params: Promise<{ type: ItemType }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { type } = await params;

  const prismaType = mapItemTypeToPrisma(type);

  const items = await prisma.discoverItem.findMany({
    where: { type: prismaType },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ items });
}

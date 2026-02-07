import { NextResponse } from 'next/server';

import { ItemType } from '@generated/prisma/enums';

import { prisma } from '@/server/db/prisma';
import { mapItemTypeToPrisma } from '@/server/lib/utils';

type Params = {
  params: Promise<{ type: ItemType; id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { type, id } = await params;

  const prismaType = mapItemTypeToPrisma(type);

  const item = await prisma.discoverItem.findUnique({
    where: { type: prismaType, id },
  });

  return NextResponse.json({ item });
}

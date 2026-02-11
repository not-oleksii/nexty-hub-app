import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/server/db/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const isRandom = Boolean(searchParams.get('random'));

  if (isRandom) {
    const count = await prisma.discoverItem.count();

    if (count === 0) {
      return NextResponse.json({ error: 'No items found' }, { status: 404 });
    }

    const item = await prisma.discoverItem.findFirst({
      skip: Math.floor(Math.random() * count),
      take: 1,
    });

    return NextResponse.json({ item });
  }

  const items = await prisma.discoverItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ items });
}

import { NextResponse } from 'next/server';

import { prisma } from '@/server/db/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isRandom = searchParams.get('random') === 'true';

  if (isRandom) {
    const count = await prisma.discoverItem.count();

    if (count === 0) {
      return NextResponse.json({ error: 'No items found' }, { status: 404 });
    }

    const item = await prisma.discoverItem.findFirst({
      orderBy: { id: 'asc' },
      skip: Math.floor(Math.random() * count),
    });

    return NextResponse.json({ item });
  }

  const items = await prisma.discoverItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ items });
}

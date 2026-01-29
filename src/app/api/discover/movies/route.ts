import { NextResponse } from 'next/server';

import { prisma } from '@/server/db/prisma';

export async function GET() {
  const items = await prisma.discoverItem.findMany({
    where: { type: 'MOVIE' },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ items });
}

import { NextResponse } from 'next/server';

import { prisma } from '@/server/db/prisma';

export async function GET() {
  const items = await prisma.discoverItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ items });
}

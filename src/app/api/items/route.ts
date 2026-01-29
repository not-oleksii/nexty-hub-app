import { NextResponse } from 'next/server';

import { prisma } from '@/server/db/prisma';

type CreateItemBody = {
  type: 'MOVIE' | 'SERIES' | 'GAME' | 'BOOK' | 'COURSE' | 'OTHER';
  category?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  status?: 'TODO' | 'DONE';
};

export async function POST(req: Request) {
  const body = (await req.json()) as CreateItemBody;

  if (!body?.type || !body?.title) {
    return NextResponse.json({ error: 'type and title are required' }, { status: 400 });
  }

  const item = await prisma.discoverItem.create({
    data: {
      type: body.type,
      category: body.category,
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
      status: body.status ?? 'TODO',
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}

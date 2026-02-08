import { NextResponse } from 'next/server';

import { DiscoverItem } from '@generated/prisma/client';

import { prisma } from '@/server/db/prisma';

import { ApiErrorType } from '../error-types';

type CreateItemBody = Omit<DiscoverItem, 'id' | 'createdAt' | 'updatedAt'>;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateItemBody;

    if (!body?.type || !body?.title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 },
      );
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
  } catch (error: unknown) {
    console.error('Error creating item:', error);

    return NextResponse.json(
      { error: ApiErrorType.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}

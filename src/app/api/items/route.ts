import { NextResponse } from 'next/server';

import { ItemType } from '@generated/prisma/enums';

import { getUserId } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';

import { ApiErrorType } from '../error-types';

type CreateItemBody = {
  type: ItemType;
  category?: string | null;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  completed?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateItemBody;

    if (!body?.type || !body?.title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 },
      );
    }

    const title = body.title.trim();
    const titlePattern = /^[A-Za-z0-9][A-Za-z0-9\s'’\-:.,!?()&/+#]*$/;

    if (!titlePattern.test(title)) {
      return NextResponse.json(
        {
          error:
            'Title can only include letters, numbers, spaces, and common title symbols.',
        },
        { status: 400 },
      );
    }

    const existingItem = await prisma.discoverItem.findFirst({
      where: { title },
      select: { id: true },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: 'Title must be unique' },
        { status: 409 },
      );
    }

    const userId = await getUserId();

    if (body.completed && !userId) {
      return NextResponse.json(
        { error: ApiErrorType.UNAUTHORIZED },
        { status: 401 },
      );
    }

    const item = await prisma.discoverItem.create({
      data: {
        type: body.type,
        category: body.category,
        title,
        description: body.description,
        imageUrl: body.imageUrl,
        ...(body.completed && userId
          ? { usersCompleted: { connect: { id: userId } } }
          : {}),
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

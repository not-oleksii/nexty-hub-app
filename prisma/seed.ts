import 'dotenv/config';

import { ItemType, PrismaClient } from '@generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { hashPassword } from '@/app/api/users/route';

const connectionString = process.env.DATABASE_URL ?? '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.discoverItem.count();

  if (count === 0) {
    await prisma.discoverItem.createMany({
      data: [
        {
          type: ItemType.MOVIE,
          category: 'Sci-Fi',
          title: 'Interstellar',
          description:
            'A team travels through a wormhole in search of a new home for humanity.',
          imageUrl: 'https://i.imgur.com/bVXo3zK.jpeg',
        },
        {
          type: ItemType.MOVIE,
          category: 'Drama',
          title: 'Lost in Translation',
          description:
            'A middle-aged actor and a young woman form a connection in Tokyo.',
          imageUrl: 'https://broken.url/not-found.png',
        },
        {
          type: ItemType.MOVIE,
          category: 'Drama',
          title: 'Whiplash',
          description:
            'A young drummer and an intense instructor push each other to extremes.',
          imageUrl:
            'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=600&q=80',
        },
        {
          type: ItemType.SERIES,
          category: 'Crime',
          title: 'True Detective (S1)',
          description:
            'Two detectives investigate a series of ritualistic crimes.',
          imageUrl: 'https://i.imgur.com/IE7Af0Z.png',
        },
        {
          type: ItemType.GAME,
          category: 'RPG',
          title: 'Disco Elysium',
          description: 'A detective RPG with deep dialogue and choices.',
          imageUrl:
            'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
        },
        {
          type: ItemType.BOOK,
          category: 'Non-fiction',
          title: 'Atomic Habits',
          description:
            'Practical strategies to build good habits and break bad ones.',
          imageUrl:
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
        },
      ],
    });
  }

  await prisma.user.upsert({
    where: { username: 'testuser1' },
    update: {},
    create: {
      username: 'testuser1',
      passwordHash: hashPassword('test1234'),
    },
  });

  await prisma.user.upsert({
    where: { username: 'testuser2' },
    update: {},
    create: {
      username: 'testuser2',
      passwordHash: hashPassword('test1234'),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

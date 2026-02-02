import { prisma } from '@/server/db/prisma';

async function main() {
  const count = await prisma.discoverItem.count();

  if (count > 0) {
    return;
  }

  await prisma.discoverItem.createMany({
    data: [
      {
        type: 'MOVIE',
        category: 'Sci-Fi',
        title: 'Interstellar',
        description:
          'A team travels through a wormhole in search of a new home for humanity.',
        imageUrl:
          'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80',
        status: 'TODO',
      },
      {
        type: 'MOVIE',
        category: 'Drama',
        title: 'Whiplash',
        description:
          'A young drummer and an intense instructor push each other to extremes.',
        imageUrl:
          'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=600&q=80',
        status: 'TODO',
      },
      {
        type: 'SERIES',
        category: 'Crime',
        title: 'True Detective (S1)',
        description:
          'Two detectives investigate a series of ritualistic crimes.',
        imageUrl:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
        status: 'TODO',
      },
      {
        type: 'GAME',
        category: 'RPG',
        title: 'Disco Elysium',
        description: 'A detective RPG with deep dialogue and choices.',
        imageUrl:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
        status: 'TODO',
      },
      {
        type: 'BOOK',
        category: 'Non-fiction',
        title: 'Atomic Habits',
        description:
          'Practical strategies to build good habits and break bad ones.',
        imageUrl:
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
        status: 'DONE',
      },
    ],
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

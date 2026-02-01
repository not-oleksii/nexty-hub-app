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
        description: 'A team travels through a wormhole in search of a new home for humanity.',
        imageUrl: 'https://picsum.photos/seed/interstellar/600/800',
        status: 'TODO',
      },
      {
        type: 'MOVIE',
        category: 'Drama',
        title: 'Whiplash',
        description: 'A young drummer and an intense instructor push each other to extremes.',
        imageUrl: 'https://picsum.photos/seed/whiplash/600/800',
        status: 'TODO',
      },
      {
        type: 'SERIES',
        category: 'Crime',
        title: 'True Detective (S1)',
        description: 'Two detectives investigate a series of ritualistic crimes.',
        imageUrl: 'https://picsum.photos/seed/true-detective/600/800',
        status: 'TODO',
      },
      {
        type: 'GAME',
        category: 'RPG',
        title: 'Disco Elysium',
        description: 'A detective RPG with deep dialogue and choices.',
        imageUrl: 'https://picsum.photos/seed/disco-elysium/600/800',
        status: 'TODO',
      },
      {
        type: 'BOOK',
        category: 'Non-fiction',
        title: 'Atomic Habits',
        description: 'Practical strategies to build good habits and break bad ones.',
        imageUrl: 'https://picsum.photos/seed/atomic-habits/600/800',
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

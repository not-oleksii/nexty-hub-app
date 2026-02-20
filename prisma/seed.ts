import 'dotenv/config';

import {
  DiscoverItemType,
  FriendshipStatus,
  ListRole,
  ListVisibility,
  PrismaClient,
  TrackingStatus,
} from '@generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { hashPassword } from '@/server/utils/password';

const connectionString = process.env.DATABASE_URL ?? '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Cleaning database...');
  await prisma.friendship.deleteMany();
  await prisma.userItemTracking.deleteMany();
  await prisma.listMembership.deleteMany();
  await prisma.userList.deleteMany();
  await prisma.discoverItem.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating users...');
  const user1 = await prisma.user.create({
    data: {
      username: 'alex_dev',
      passwordHash: hashPassword('test1234'),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'design_guru',
      passwordHash: hashPassword('test1234'),
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: 'lonely_gamer',
      passwordHash: hashPassword('test1234'),
    },
  });

  console.log('Establishing social connections...');
  await prisma.friendship.create({
    data: {
      requesterId: user1.id,
      addresseeId: user2.id,
      status: FriendshipStatus.ACCEPTED,
    },
  });

  await prisma.friendship.create({
    data: {
      requesterId: user3.id,
      addresseeId: user1.id,
      status: FriendshipStatus.PENDING,
    },
  });

  console.log('Creating Discover Items...');
  const itemInterstellar = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.MOVIE,
      category: 'Sci-Fi',
      title: 'Interstellar',
      description: 'A team travels through a wormhole in search of a new home.',
      imageUrl: 'https://i.imgur.com/bVXo3zK.jpeg',
    },
  });

  const itemDbd = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.GAME,
      category: 'Horror/Co-op',
      title: 'Dead by Daylight',
      description:
        'Asymmetric multiplayer survival horror game. Trying to master the Blight build.',
      imageUrl:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    },
  });

  const itemLinux = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.COURSE,
      category: 'IT/DevOps',
      title: 'Linux Mastery Bootcamp',
      description:
        'Learning terminal commands, bash scripting, and system administration.',
      imageUrl:
        'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80',
    },
  });

  const itemCoffee = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.OTHER,
      category: 'Wishlist',
      title: 'Sage Barista Express',
      description:
        'An espresso machine with a built-in grinder for the perfect morning brew.',
      imageUrl: 'https://broken.url/not-found.png',
    },
  });

  const itemLongText = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.BOOK,
      category: 'Software Architecture',
      title:
        'The Extremely Convoluted And Incredibly Long Title Of A Book About Next.js Advanced Patterns And Server Components Routing',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      imageUrl:
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
    },
  });

  const itemMissingData = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.OTHER,
      title: 'Mystery Item Without Description or Image',
      category: null,
      description: null,
      imageUrl: null,
    },
  });

  console.log('Creating Lists and access rights...');

  const mainList = await prisma.userList.create({
    data: {
      name: 'My Backlog 2026',
      visibility: ListVisibility.PUBLIC,
      ownerId: user1.id,
      discoverItems: {
        connect: [
          { id: itemLinux.id },
          { id: itemDbd.id },
          { id: itemLongText.id },
        ],
      },
    },
  });

  const sharedList = await prisma.userList.create({
    data: {
      name: 'Coffee Setup Wishlist',
      visibility: ListVisibility.FRIENDS_ONLY,
      ownerId: user1.id,
      discoverItems: {
        connect: [{ id: itemCoffee.id }, { id: itemMissingData.id }],
      },
    },
  });

  await prisma.listMembership.create({
    data: {
      userId: user2.id,
      listId: sharedList.id,
      role: ListRole.EDITOR,
    },
  });

  await prisma.userList.create({
    data: {
      name: 'Secret Empty Ideas',
      visibility: ListVisibility.PRIVATE,
      ownerId: user1.id,
    },
  });

  const completedList = await prisma.userList.create({
    data: {
      name: 'Finished Masterpieces',
      visibility: ListVisibility.PUBLIC,
      ownerId: user1.id,
      discoverItems: {
        connect: [{ id: itemInterstellar.id }],
      },
    },
  });

  console.log('Adding personal tracking (Progress)...');

  await prisma.userItemTracking.createMany({
    data: [
      {
        userId: user1.id,
        itemId: itemLinux.id,
        status: TrackingStatus.IN_PROGRESS,
      },
      { userId: user1.id, itemId: itemDbd.id, status: TrackingStatus.BACKLOG },
      {
        userId: user1.id,
        itemId: itemInterstellar.id,
        status: TrackingStatus.COMPLETED,
        rating: 10,
        review: 'Masterpiece!',
      },
      {
        userId: user1.id,
        itemId: itemLongText.id,
        status: TrackingStatus.DROPPED,
      },
    ],
  });

  console.log('Database successfully populated with test data!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error in seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

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
  await prisma.savedList.deleteMany();
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

  // Edge case: linear progress (totalUnits + unitName) – series
  const itemSeries = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.SERIES,
      category: 'Drama',
      title: 'Breaking Bad',
      description: 'A high school chemistry teacher turns to cooking meth.',
      imageUrl:
        'https://images.unsplash.com/photo-1616530940355-351fab0da436?auto=format&fit=crop&w=600&q=80',
      totalUnits: 62,
      unitName: 'episodes',
    },
  });

  // Edge case: book with pages
  const itemBookPages = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.BOOK,
      category: 'Programming',
      title: 'Clean Code',
      description: 'A Handbook of Agile Software Craftsmanship.',
      imageUrl:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      totalUnits: 464,
      unitName: 'pages',
    },
  });

  // Edge case: totalUnits = 1 (single unit)
  const itemSingleEpisode = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.SERIES,
      category: 'Documentary',
      title: 'Planet Earth (Pilot)',
      description: 'Single documentary episode.',
      imageUrl: null,
      totalUnits: 1,
      unitName: 'episode',
    },
  });

  // Edge case: totalUnits set but unitName null (progress UI may hide or fallback)
  const itemUnitsNoName = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.COURSE,
      category: 'Design',
      title: 'Figma Basics',
      description: '10 modules to complete.',
      imageUrl: null,
      totalUnits: 10,
      unitName: null,
    },
  });

  // Edge case: unitName without totalUnits
  const itemNameNoUnits = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.BOOK,
      category: 'Fiction',
      title: 'Infinite Jest',
      description: 'Long novel, no page goal set.',
      imageUrl:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
      totalUnits: null,
      unitName: 'pages',
    },
  });

  // Edge case: minimal optional fields (all null except type/title)
  const itemMinimal = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.OTHER,
      category: null,
      title: 'Minimal Item',
      description: null,
      imageUrl: null,
      totalUnits: null,
      unitName: null,
    },
  });

  // Edge case: very long description
  const itemLongDesc = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.MOVIE,
      category: 'Documentary',
      title: 'Cosmos: A Spacetime Odyssey',
      description:
        'A long description that goes on and on to test truncation and layout. '.repeat(
          20,
        ),
      imageUrl:
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80',
      totalUnits: 13,
      unitName: 'episodes',
    },
  });

  // Edge case: title with special chars / apostrophe
  const itemSpecialTitle = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.BOOK,
      category: 'Classics',
      title: "The Hitchhiker's Guide to the Galaxy",
      description: "Don't panic. A comedy sci-fi novel.",
      imageUrl: null,
      totalUnits: 224,
      unitName: 'pages',
    },
  });

  // Edge case: game with "levels" as unit
  const itemGameLevels = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.GAME,
      category: 'Platformer',
      title: 'Celeste',
      description: 'Climb the mountain. 8 main chapters.',
      imageUrl:
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
      totalUnits: 8,
      unitName: 'chapters',
    },
  });

  // Edge case: item in no lists (orphan discover item)
  const itemOrphan = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.MOVIE,
      category: 'Indie',
      title: 'Nobody Will Save You',
      description: 'A film with no lists yet.',
      imageUrl: null,
    },
  });

  // Edge case: course with sections
  const itemCourseSections = await prisma.discoverItem.create({
    data: {
      type: DiscoverItemType.COURSE,
      category: 'Web Dev',
      title: 'Next.js App Router Deep Dive',
      description: 'Server components, streaming, and caching.',
      imageUrl:
        'https://images.unsplash.com/photo-1555066931-4365d15bab2c?auto=format&fit=crop&w=600&q=80',
      totalUnits: 15,
      unitName: 'sections',
    },
  });

  console.log('Creating Lists and access rights...');

  const backlogList = await prisma.userList.create({
    data: {
      name: 'My Backlog 2026',
      visibility: ListVisibility.PUBLIC,
      ownerId: user1.id,
      discoverItems: {
        connect: [
          { id: itemLinux.id },
          { id: itemDbd.id },
          { id: itemLongText.id },
          { id: itemSeries.id },
          { id: itemBookPages.id },
          { id: itemGameLevels.id },
          { id: itemCourseSections.id },
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

  const finishedList = await prisma.userList.create({
    data: {
      name: 'Finished Masterpieces',
      visibility: ListVisibility.PUBLIC,
      ownerId: user1.id,
      discoverItems: {
        connect: [{ id: itemInterstellar.id }, { id: itemSingleEpisode.id }],
      },
    },
  });

  // List owned by user2 (public) – can be saved by user1/user3
  const user2PublicList = await prisma.userList.create({
    data: {
      name: 'Design Inspiration',
      visibility: ListVisibility.PUBLIC,
      ownerId: user2.id,
      discoverItems: {
        connect: [
          { id: itemSeries.id },
          { id: itemLongDesc.id },
          { id: itemSpecialTitle.id },
        ],
      },
    },
  });

  // user3 has one public list (edge: user with one list)
  await prisma.userList.create({
    data: {
      name: 'Solo Gamer Backlog',
      visibility: ListVisibility.PUBLIC,
      ownerId: user3.id,
      discoverItems: {
        connect: [
          { id: itemDbd.id },
          { id: itemGameLevels.id },
          { id: itemOrphan.id },
        ],
      },
    },
  });

  // Edge: list with only one item
  await prisma.userList.create({
    data: {
      name: 'Single Item List',
      visibility: ListVisibility.PUBLIC,
      ownerId: user1.id,
      discoverItems: { connect: [{ id: itemBookPages.id }] },
    },
  });

  console.log('Adding saved lists (user1 saves user2 list)...');
  await prisma.savedList.create({
    data: {
      userId: user1.id,
      listId: user2PublicList.id,
    },
  });

  console.log('Adding personal tracking (Progress)...');

  await prisma.userItemTracking.createMany({
    data: [
      {
        userId: user1.id,
        itemId: itemLinux.id,
        status: TrackingStatus.IN_PROGRESS,
        progress: 0,
      },
      {
        userId: user1.id,
        itemId: itemDbd.id,
        status: TrackingStatus.BACKLOG,
        progress: 0,
      },
      {
        userId: user1.id,
        itemId: itemInterstellar.id,
        status: TrackingStatus.COMPLETED,
        progress: 0,
        rating: 10,
        review: 'Masterpiece!',
      },
      {
        userId: user1.id,
        itemId: itemLongText.id,
        status: TrackingStatus.DROPPED,
        progress: 0,
      },
      // Linear progress: in progress with partial progress
      {
        userId: user1.id,
        itemId: itemSeries.id,
        status: TrackingStatus.IN_PROGRESS,
        progress: 42,
      },
      {
        userId: user1.id,
        itemId: itemBookPages.id,
        status: TrackingStatus.IN_PROGRESS,
        progress: 120,
      },
      // Completed with progress = totalUnits
      {
        userId: user1.id,
        itemId: itemSingleEpisode.id,
        status: TrackingStatus.COMPLETED,
        progress: 1,
      },
      {
        userId: user1.id,
        itemId: itemGameLevels.id,
        status: TrackingStatus.ON_HOLD,
        progress: 3,
      },
      {
        userId: user1.id,
        itemId: itemCourseSections.id,
        status: TrackingStatus.BACKLOG,
        progress: 0,
      },
      {
        userId: user1.id,
        itemId: itemLongDesc.id,
        status: TrackingStatus.IN_PROGRESS,
        progress: 5,
      },
      // user2 tracking (edge: multiple users track same item)
      {
        userId: user2.id,
        itemId: itemSeries.id,
        status: TrackingStatus.COMPLETED,
        progress: 62,
        rating: 9,
      },
      {
        userId: user2.id,
        itemId: itemSpecialTitle.id,
        status: TrackingStatus.IN_PROGRESS,
        progress: 100,
      },
      // user3: backlog only, no progress
      {
        userId: user3.id,
        itemId: itemDbd.id,
        status: TrackingStatus.BACKLOG,
        progress: 0,
      },
      {
        userId: user3.id,
        itemId: itemOrphan.id,
        status: TrackingStatus.IN_PROGRESS,
        progress: 0,
      },
    ],
  });

  // Edge: item with totalUnits but unitName null – tracking still has progress
  await prisma.userItemTracking.create({
    data: {
      userId: user1.id,
      itemId: itemUnitsNoName.id,
      status: TrackingStatus.IN_PROGRESS,
      progress: 4,
    },
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

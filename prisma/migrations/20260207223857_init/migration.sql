-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('MOVIE', 'SERIES', 'GAME', 'BOOK', 'COURSE', 'OTHER');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('TODO', 'DONE');

-- CreateTable
CREATE TABLE "DiscoverItem" (
    "id" TEXT NOT NULL,
    "type" "ItemType" NOT NULL,
    "category" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "status" "ItemStatus" NOT NULL DEFAULT 'TODO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscoverItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserListItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "discoverItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserListItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DiscoverItem_type_idx" ON "DiscoverItem"("type");

-- CreateIndex
CREATE INDEX "DiscoverItem_status_idx" ON "DiscoverItem"("status");

-- CreateIndex
CREATE INDEX "DiscoverItem_createdAt_idx" ON "DiscoverItem"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "UserListItem_userId_idx" ON "UserListItem"("userId");

-- CreateIndex
CREATE INDEX "UserListItem_discoverItemId_idx" ON "UserListItem"("discoverItemId");

-- CreateIndex
CREATE UNIQUE INDEX "UserListItem_userId_discoverItemId_key" ON "UserListItem"("userId", "discoverItemId");

-- AddForeignKey
ALTER TABLE "UserListItem" ADD CONSTRAINT "UserListItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserListItem" ADD CONSTRAINT "UserListItem_discoverItemId_fkey" FOREIGN KEY ("discoverItemId") REFERENCES "DiscoverItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

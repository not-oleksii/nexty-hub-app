/*
  Warnings:

  - You are about to drop the `_UserCompletedItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserListUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserSavedItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ListRole" AS ENUM ('VIEWER', 'EDITOR');

-- CreateEnum
CREATE TYPE "TrackingStatus" AS ENUM ('BACKLOG', 'IN_PROGRESS', 'COMPLETED', 'DROPPED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ListVisibility" AS ENUM ('PRIVATE', 'FRIENDS_ONLY', 'PUBLIC');

-- DropForeignKey
ALTER TABLE "_UserCompletedItems" DROP CONSTRAINT "_UserCompletedItems_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserCompletedItems" DROP CONSTRAINT "_UserCompletedItems_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserListUsers" DROP CONSTRAINT "_UserListUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserListUsers" DROP CONSTRAINT "_UserListUsers_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserSavedItems" DROP CONSTRAINT "_UserSavedItems_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserSavedItems" DROP CONSTRAINT "_UserSavedItems_B_fkey";

-- AlterTable
ALTER TABLE "UserList" ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "visibility" "ListVisibility" NOT NULL DEFAULT 'PRIVATE';

-- DropTable
DROP TABLE "_UserCompletedItems";

-- DropTable
DROP TABLE "_UserListUsers";

-- DropTable
DROP TABLE "_UserSavedItems";

-- CreateTable
CREATE TABLE "ListMembership" (
    "id" TEXT NOT NULL,
    "role" "ListRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,

    CONSTRAINT "ListMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserItemTracking" (
    "id" TEXT NOT NULL,
    "status" "TrackingStatus" NOT NULL DEFAULT 'BACKLOG',
    "rating" INTEGER,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "UserItemTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "requesterId" TEXT NOT NULL,
    "addresseeId" TEXT NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ListLikes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ListLikes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "ListMembership_userId_idx" ON "ListMembership"("userId");

-- CreateIndex
CREATE INDEX "ListMembership_listId_idx" ON "ListMembership"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "ListMembership_userId_listId_key" ON "ListMembership"("userId", "listId");

-- CreateIndex
CREATE INDEX "UserItemTracking_userId_idx" ON "UserItemTracking"("userId");

-- CreateIndex
CREATE INDEX "UserItemTracking_itemId_idx" ON "UserItemTracking"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "UserItemTracking_userId_itemId_key" ON "UserItemTracking"("userId", "itemId");

-- CreateIndex
CREATE INDEX "Friendship_requesterId_idx" ON "Friendship"("requesterId");

-- CreateIndex
CREATE INDEX "Friendship_addresseeId_idx" ON "Friendship"("addresseeId");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_requesterId_addresseeId_key" ON "Friendship"("requesterId", "addresseeId");

-- CreateIndex
CREATE INDEX "_ListLikes_B_index" ON "_ListLikes"("B");

-- AddForeignKey
ALTER TABLE "ListMembership" ADD CONSTRAINT "ListMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListMembership" ADD CONSTRAINT "ListMembership_listId_fkey" FOREIGN KEY ("listId") REFERENCES "UserList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserItemTracking" ADD CONSTRAINT "UserItemTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserItemTracking" ADD CONSTRAINT "UserItemTracking_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "DiscoverItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListLikes" ADD CONSTRAINT "_ListLikes_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListLikes" ADD CONSTRAINT "_ListLikes_B_fkey" FOREIGN KEY ("B") REFERENCES "UserList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

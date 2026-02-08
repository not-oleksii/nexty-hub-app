/*
  Warnings:

  - You are about to drop the `UserListItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserListItem" DROP CONSTRAINT "UserListItem_discoverItemId_fkey";

-- DropForeignKey
ALTER TABLE "UserListItem" DROP CONSTRAINT "UserListItem_userId_fkey";

-- DropIndex
DROP INDEX "DiscoverItem_createdAt_idx";

-- DropTable
DROP TABLE "UserListItem";

-- CreateTable
CREATE TABLE "UserList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DiscoverItemToUserList" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DiscoverItemToUserList_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserToUserList" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserToUserList_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "UserList_name_idx" ON "UserList"("name");

-- CreateIndex
CREATE INDEX "_DiscoverItemToUserList_B_index" ON "_DiscoverItemToUserList"("B");

-- CreateIndex
CREATE INDEX "_UserToUserList_B_index" ON "_UserToUserList"("B");

-- CreateIndex
CREATE INDEX "DiscoverItem_title_idx" ON "DiscoverItem"("title");

-- CreateIndex
CREATE INDEX "DiscoverItem_category_idx" ON "DiscoverItem"("category");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- AddForeignKey
ALTER TABLE "_DiscoverItemToUserList" ADD CONSTRAINT "_DiscoverItemToUserList_A_fkey" FOREIGN KEY ("A") REFERENCES "DiscoverItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscoverItemToUserList" ADD CONSTRAINT "_DiscoverItemToUserList_B_fkey" FOREIGN KEY ("B") REFERENCES "UserList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserList" ADD CONSTRAINT "_UserToUserList_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserList" ADD CONSTRAINT "_UserToUserList_B_fkey" FOREIGN KEY ("B") REFERENCES "UserList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

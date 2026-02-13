/*
  Warnings:

  - You are about to drop the column `status` on the `DiscoverItem` table. All the data in the column will be lost.
  - You are about to drop the `_DiscoverItemToUserList` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `DiscoverItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DiscoverItemType" AS ENUM ('MOVIE', 'SERIES', 'GAME', 'BOOK', 'COURSE', 'OTHER');

-- DropForeignKey
ALTER TABLE "_DiscoverItemToUserList" DROP CONSTRAINT "_DiscoverItemToUserList_A_fkey";

-- DropForeignKey
ALTER TABLE "_DiscoverItemToUserList" DROP CONSTRAINT "_DiscoverItemToUserList_B_fkey";

-- DropIndex
DROP INDEX "DiscoverItem_status_idx";

-- AlterTable
ALTER TABLE "DiscoverItem" DROP COLUMN "status",
ADD COLUMN     "ownerId" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "DiscoverItemType" NOT NULL;

-- DropTable
DROP TABLE "_DiscoverItemToUserList";

-- DropEnum
DROP TYPE "ItemStatus";

-- DropEnum
DROP TYPE "ItemType";

-- CreateTable
CREATE TABLE "_UserListItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserListItems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserSavedItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserSavedItems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserCompletedItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserCompletedItems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserListItems_B_index" ON "_UserListItems"("B");

-- CreateIndex
CREATE INDEX "_UserSavedItems_B_index" ON "_UserSavedItems"("B");

-- CreateIndex
CREATE INDEX "_UserCompletedItems_B_index" ON "_UserCompletedItems"("B");

-- CreateIndex
CREATE INDEX "DiscoverItem_type_idx" ON "DiscoverItem"("type");

-- AddForeignKey
ALTER TABLE "DiscoverItem" ADD CONSTRAINT "DiscoverItem_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserListItems" ADD CONSTRAINT "_UserListItems_A_fkey" FOREIGN KEY ("A") REFERENCES "DiscoverItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserListItems" ADD CONSTRAINT "_UserListItems_B_fkey" FOREIGN KEY ("B") REFERENCES "UserList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSavedItems" ADD CONSTRAINT "_UserSavedItems_A_fkey" FOREIGN KEY ("A") REFERENCES "DiscoverItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSavedItems" ADD CONSTRAINT "_UserSavedItems_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCompletedItems" ADD CONSTRAINT "_UserCompletedItems_A_fkey" FOREIGN KEY ("A") REFERENCES "DiscoverItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCompletedItems" ADD CONSTRAINT "_UserCompletedItems_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `_UserToUserList` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `UserList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserToUserList" DROP CONSTRAINT "_UserToUserList_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserList" DROP CONSTRAINT "_UserToUserList_B_fkey";

-- AlterTable
ALTER TABLE "UserList" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_UserToUserList";

-- CreateTable
CREATE TABLE "_UserListUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserListUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserListUsers_B_index" ON "_UserListUsers"("B");

-- AddForeignKey
ALTER TABLE "UserList" ADD CONSTRAINT "UserList_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserListUsers" ADD CONSTRAINT "_UserListUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserListUsers" ADD CONSTRAINT "_UserListUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "UserList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

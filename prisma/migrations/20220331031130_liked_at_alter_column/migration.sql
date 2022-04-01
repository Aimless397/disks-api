/*
  Warnings:

  - You are about to drop the column `likedAt` on the `user_reactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_reactions" DROP COLUMN "likedAt",
ADD COLUMN     "liked_at" TIMESTAMP(0);

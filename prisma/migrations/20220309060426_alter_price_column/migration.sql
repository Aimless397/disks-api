/*
  Warnings:

  - You are about to alter the column `price` on the `disks` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Real`.

*/
-- AlterTable
ALTER TABLE "disks" ALTER COLUMN "price" SET DATA TYPE REAL;

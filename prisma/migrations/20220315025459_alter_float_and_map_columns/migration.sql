/*
  Warnings:

  - You are about to alter the column `selection_price` on the `cart_products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Real`.
  - You are about to alter the column `total` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Real`.

*/
-- AlterTable
ALTER TABLE "cart_products" ALTER COLUMN "selection_price" SET DATA TYPE REAL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "total" SET DATA TYPE REAL;

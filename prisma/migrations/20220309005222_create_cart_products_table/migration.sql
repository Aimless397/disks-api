-- CreateTable
CREATE TABLE "cart_products" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "disk_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "selection_price" DECIMAL(10,2) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cart_products" ADD CONSTRAINT "cart_products_disk_id_fkey" FOREIGN KEY ("disk_id") REFERENCES "disks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_products" ADD CONSTRAINT "cart_products_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "disks" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "subgenre" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "band" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "created_created" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "disks_uuid_key" ON "disks"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "disks_cover_key" ON "disks"("cover");

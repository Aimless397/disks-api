-- CreateTable
CREATE TABLE "user_reactions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "disk_id" INTEGER NOT NULL,
    "like" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_reactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_reactions" ADD CONSTRAINT "user_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reactions" ADD CONSTRAINT "user_reactions_disk_id_fkey" FOREIGN KEY ("disk_id") REFERENCES "disks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

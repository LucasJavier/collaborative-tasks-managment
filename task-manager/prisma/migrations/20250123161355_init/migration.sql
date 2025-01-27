/*
  Warnings:

  - Added the required column `usuarioIdCreo` to the `tarea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tarea" ADD COLUMN     "usuarioIdCreo" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tarea" ADD CONSTRAINT "tarea_usuarioIdCreo_fkey" FOREIGN KEY ("usuarioIdCreo") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

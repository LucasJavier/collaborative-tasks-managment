/*
  Warnings:

  - Added the required column `fechaComentario` to the `comentarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comentarios" ADD COLUMN     "fechaComentario" TIMESTAMP(3) NOT NULL;

/*
  Warnings:

  - Added the required column `fechaLimite` to the `tarea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prioridad` to the `tarea` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Prioridad" AS ENUM ('baja', 'media', 'alta');

-- AlterTable
ALTER TABLE "tarea" ADD COLUMN     "fechaLimite" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "prioridad" "Prioridad" NOT NULL;

-- CreateTable
CREATE TABLE "comentarios" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tareaId" INTEGER NOT NULL,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "tarea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

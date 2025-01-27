/*
  Warnings:

  - A unique constraint covering the columns `[codigoInvitacion]` on the table `Equipo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Equipo" ADD COLUMN     "codigoExpiracion" TIMESTAMP(3),
ADD COLUMN     "codigoInvitacion" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Equipo_codigoInvitacion_key" ON "Equipo"("codigoInvitacion");

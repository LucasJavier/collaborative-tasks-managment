/*
  Warnings:

  - Added the required column `idJefe` to the `Equipo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Equipo" ADD COLUMN     "idJefe" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_idJefe_fkey" FOREIGN KEY ("idJefe") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

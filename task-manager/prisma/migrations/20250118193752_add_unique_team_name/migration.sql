/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `equipo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "equipo_nombre_key" ON "equipo"("nombre");

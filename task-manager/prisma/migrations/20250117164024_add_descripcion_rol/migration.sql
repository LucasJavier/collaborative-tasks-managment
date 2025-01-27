/*
  Warnings:

  - Added the required column `descripcion` to the `Rol` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rol" ADD COLUMN     "descripcion" TEXT NOT NULL;

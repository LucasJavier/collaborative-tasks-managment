/*
  Warnings:

  - Changed the type of `prioridad` on the `tarea` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "prioridad" AS ENUM ('baja', 'media', 'alta');

-- AlterTable
ALTER TABLE "tarea" DROP COLUMN "prioridad",
ADD COLUMN     "prioridad" "prioridad" NOT NULL;

-- DropEnum
DROP TYPE "Prioridad";

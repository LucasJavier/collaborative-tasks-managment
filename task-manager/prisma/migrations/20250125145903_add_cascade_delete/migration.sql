-- DropForeignKey
ALTER TABLE "tarea" DROP CONSTRAINT "tarea_equipoId_fkey";

-- DropForeignKey
ALTER TABLE "usuario_equipo" DROP CONSTRAINT "usuario_equipo_equipoId_fkey";

-- AddForeignKey
ALTER TABLE "tarea" ADD CONSTRAINT "tarea_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "equipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_equipo" ADD CONSTRAINT "usuario_equipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "equipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

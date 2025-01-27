-- DropForeignKey
ALTER TABLE "comentarios" DROP CONSTRAINT "comentarios_tareaId_fkey";

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "tarea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

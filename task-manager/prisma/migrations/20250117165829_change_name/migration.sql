/*
  Warnings:

  - You are about to drop the `Equipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rol` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tarea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsuarioEquipo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Equipo" DROP CONSTRAINT "Equipo_idJefe_fkey";

-- DropForeignKey
ALTER TABLE "Tarea" DROP CONSTRAINT "Tarea_equipoId_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_rolID_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioEquipo" DROP CONSTRAINT "UsuarioEquipo_equipoId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioEquipo" DROP CONSTRAINT "UsuarioEquipo_usuarioId_fkey";

-- DropTable
DROP TABLE "Equipo";

-- DropTable
DROP TABLE "Rol";

-- DropTable
DROP TABLE "Tarea";

-- DropTable
DROP TABLE "Usuario";

-- DropTable
DROP TABLE "UsuarioEquipo";

-- CreateTable
CREATE TABLE "rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "nombreUsuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rolID" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idJefe" INTEGER NOT NULL,
    "codigoInvitacion" TEXT,
    "codigoExpiracion" TIMESTAMP(3),

    CONSTRAINT "equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarea" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "equipoId" INTEGER NOT NULL,

    CONSTRAINT "tarea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_equipo" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "equipoId" INTEGER NOT NULL,

    CONSTRAINT "usuario_equipo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_nombreUsuario_key" ON "usuario"("nombreUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "equipo_codigoInvitacion_key" ON "equipo"("codigoInvitacion");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_rolID_fkey" FOREIGN KEY ("rolID") REFERENCES "rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipo" ADD CONSTRAINT "equipo_idJefe_fkey" FOREIGN KEY ("idJefe") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarea" ADD CONSTRAINT "tarea_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_equipo" ADD CONSTRAINT "usuario_equipo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_equipo" ADD CONSTRAINT "usuario_equipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

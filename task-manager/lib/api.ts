import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { addHours } from "date-fns";

export async function crearEquipo(nombre: string, idJefe: number) {
  const equipoExistente = await prisma.equipo.findUnique({
    where: { nombre },
  });

  if (equipoExistente) {
    throw new Error("Ya existe un equipo con el mismo nombre.");
  }

  const codigoInvitacion = nanoid(10);
  const codigoExpiracion = addHours(new Date(), 1);

  const equipo = await prisma.equipo.create({
    data: {
      nombre,
      idJefe,
      codigoInvitacion,
      codigoExpiracion,
    },
  });

  await prisma.usuarioEquipo.create({
    data: {
      usuarioId: idJefe,
      equipoId: equipo.id,
    },
  });

  return equipo;
}

export async function unirseEquipo(codigoInvitacion: string, usuarioId: number) {
  if (!codigoInvitacion || !usuarioId) {
    throw new Error("Faltan parámetros.");
  }

  const equipo = await prisma.equipo.findUnique({
    where: { codigoInvitacion },
  });

  if (!equipo) {
    throw new Error("El código de invitación no es válido.");
  }

  const miembroExistente = await prisma.usuarioEquipo.findFirst({
    where: {
      usuarioId,
      equipoId: equipo.id,
    },
  });

  if (miembroExistente) {
    throw new Error("El usuario ya es parte del equipo.");
  }

  await prisma.usuarioEquipo.create({
    data: {
      usuarioId,
      equipoId: equipo.id,
    },
  });

  return equipo;
}

export async function generarCodigo(idEquipo: number) {
  const equipoExistente = await prisma.equipo.findUnique({
    where: { id: idEquipo },
  });

  if (!equipoExistente) {
    throw new Error("No existe el equipo.");
  }

  const codigoInvitacion = nanoid(10);
  const codigoExpiracion = addHours(new Date(), 1);

  const equipo = await prisma.equipo.update({
    where: { id: idEquipo},
    data: {
      codigoInvitacion,
      codigoExpiracion,
    },
  });

  return equipo;
}
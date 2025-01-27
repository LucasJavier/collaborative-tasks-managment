import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { titulo, descripcion, equipoId, prioridad, fechaLimite, usuarioIdCreo } = await req.json();

    if (!titulo || !prioridad || !fechaLimite || !equipoId || !usuarioIdCreo) {
      return NextResponse.json(
        { error: "Datos incompletos para crear la tarea." },
        { status: 400 }
      );
    }

    const tarea = await prisma.tarea.create({
      data: {
        titulo,
        descripcion,
        equipoId,
        prioridad,
        fechaLimite: new Date(fechaLimite),
        usuarioIdCreo,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombreUsuario: true,
          },
        },
      },
    });
    return NextResponse.json(tarea, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear la tarea." }, { status: 500 });
  }
}

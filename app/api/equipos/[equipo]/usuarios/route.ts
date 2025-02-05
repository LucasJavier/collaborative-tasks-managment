import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ equipo: string }> }) {
  try {
    const { equipo } = await params;
    const equipoId = parseInt(equipo);

    if (isNaN(equipoId)) {
      return NextResponse.json(
        { error: "El parámetro equipoId es inválido." },
        { status: 400 }
      );
    }

    const usuarios = await prisma.usuario.findMany({
      where: {
        equipos: {
          some: {
            equipoId: equipoId,
          },
        },
      },
      select: {
        id: true,
        nombreUsuario: true,
        email: true,
      },
    });

    if (usuarios.length === 0) {
      return NextResponse.json(
        { error: "No se encontraron usuarios para este equipo." },
        { status: 404 }
      );
    }

    return NextResponse.json({ usuarios });
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener los usuarios." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ equipo: string }> }) {
  try {
    const { equipo } = await params;
    const { usuarioId } = await request.json(); 

    const equipoId = parseInt(equipo);
    const  idUsuario = Number(usuarioId)

    if (isNaN(equipoId)) {
      return NextResponse.json({ error: "ID de equipo inválido" }, { status: 400 });
    }

    if (isNaN(idUsuario)) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
    }

    const usuarioEquipo = await prisma.usuarioEquipo.findFirst({
        where: {
          usuarioId: idUsuario,
          equipoId: equipoId,
        },
      });

      
      if (usuarioEquipo) {
        await prisma.usuarioEquipo.delete({
          where: {
            id: usuarioEquipo.id,
          },
        });
      }

    return NextResponse.json({ message: "Usuario eliminado exitosamente del equipo." });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al eliminar el usuario." },
      { status: 500 }
    );
  }
}
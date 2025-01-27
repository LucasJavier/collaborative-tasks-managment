import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.JWT_CLAVE! });

    if (!token || !token.id) {
      return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 });
    }

    const userId = token.id;

    const equipos = await prisma.equipo.findMany({
      where: {
        usuarios: {
          some: {
            usuarioId: userId,
          },
        },
      },
      select: {
        id: true,
        nombre: true,
        creadoEn: true,
        usuarioJefe: {
          select: {
            nombreUsuario: true, 
          },
        },
        idJefe: true,
      },
    });

    return NextResponse.json(equipos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener los equipos." }, { status: 500 });
  }
}
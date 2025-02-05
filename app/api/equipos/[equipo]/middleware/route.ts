import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest,  { params }: { params: Promise<{ equipo: string }> }) {
  try {
    const { equipo }   = await params;
    const equipoId = parseInt(equipo);

    if (isNaN(equipoId)) {
      return NextResponse.json(
        { error: "El parámetro equipoId es inválido o no se proporcionó." },
        { status: 400 }
      );
    }

    const token = await getToken({ 
      req: request, 
      cookieName: process.env.NODE_ENV === "development"
                ? "next-auth.session-token"
                : "__Secure-next-auth.session-token",
      secret: process.env.NEXTAUTH_SECRET! });

    if (!token || !token.id) {
      return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 });
    }

    const userId = token.id;

    const usuarioEquipo = await prisma.usuarioEquipo.findFirst({
      where: {
        usuarioId: userId,
        equipoId: equipoId,
      },
    });

    if (!usuarioEquipo) {
      return NextResponse.json(
        { error: "Acceso denegado. El usuario no pertenece al equipo." },
        { status: 403 }
      );
    }

    return NextResponse.json({ message: "Acceso permitido" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Ocurrió un error en el servidor." },
      { status: 500 }
    );
  }
}
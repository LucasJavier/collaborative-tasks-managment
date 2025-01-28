import { NextResponse } from "next/server";
import { unirseEquipo } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const { codigoInvitacion, usuarioId } = await request.json();

    const response = await unirseEquipo(codigoInvitacion, usuarioId);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.message || "Error interno del servidor.";
    const statusCode = error.message === "Faltan parámetros." || error.message === "El usuario ya es parte del equipo."
      ? 400
      : error.message === "El código de invitación no es válido."
      ? 404
      : 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
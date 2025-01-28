import { NextResponse } from "next/server";
import { crearEquipo, generarCodigo } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const { nombre, idJefe } = await request.json();

    if (!nombre || !idJefe) {
      return NextResponse.json({ error: "Faltan parámetros." }, { status: 400 });
    }

    const equipo = await crearEquipo(nombre, idJefe);

    return NextResponse.json({ 
      message: "Equipo creado exitosamente.", 
      codigoInvitacion: equipo.codigoInvitacion 
    });
  } catch (error) {
    console.error("Error al crear el equipo:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { idEquipo } = await request.json();

    if (!idEquipo) {
      return NextResponse.json({ error: "Faltan parámetros." }, { status: 400 });
    }

    const equipo = await generarCodigo(idEquipo);

    return NextResponse.json({ 
      message: "Código creado exitosamente.", 
      codigoInvitacion: equipo.codigoInvitacion 
    });
  } catch (error) {
    console.error("Error al crear el código:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
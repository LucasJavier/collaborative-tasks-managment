import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { nombre, apellido, nombreUsuario, email, password } = await req.json();

  if(!nombre || !apellido || !nombreUsuario || !email || !password){
    return new NextResponse(
      JSON.stringify({ message: "Todos los campos son requeridos" }),
      {
        status: 400
      }
    )};

  try {

    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        OR: [{ nombreUsuario }, { email }],
      },
    });

    if(usuarioExistente) {
      return NextResponse.json(
        { error: "El usuario o correo ya está registrado." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        nombreUsuario,
        email,
        password: hashedPassword,
        rolID: 1,
      },
    });

    return NextResponse.json(
      { message: "Usuario creado exitosamente.", usuario: nuevoUsuario },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en el registro:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
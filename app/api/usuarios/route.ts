import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try{
    const { nombre, apellido, nombreUsuario, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const usuario = await prisma.usuario.create({
      data: { nombre, apellido, nombreUsuario, email, password: hashedPassword },
    });
  
    return NextResponse.json({ mensaje: "Usuario creado exitosamente", usuario }, { status: 200 });
  } catch (error){
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });
  }
}
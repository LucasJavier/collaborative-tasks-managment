import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { nombre, apellido, nombreUsuario, email, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.create({
    data: { nombre, apellido, nombreUsuario, email, password: hashedPassword },
  });

  return NextResponse.json(usuario);
}
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { format, startOfDay, endOfDay } from "date-fns"; // Importar para trabajar con fechas
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.JWT_CLAVE! });
    if (!token || !token.id) {
        return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 });
    }

    const userId = token.id;

    try {
        const today = new Date();
        const comienzoDia = startOfDay(today);
        const finDelDia = endOfDay(today);

        const tareas = await prisma.tarea.findMany({
            where: {
                fechaLimite: {
                    gte: comienzoDia, 
                    lt: finDelDia, 
                },
                equipo: {
                    usuarios: {
                        some: {
                            usuarioId: userId,
                        },
                    },
                },
            },
            include: {
                equipo: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
                usuario: {
                    select: {
                        nombreUsuario: true, 
                    },
                },
            },
        });

        if (!tareas || tareas.length === 0) {
            return NextResponse.json({ message: "No hay tareas para hoy." }, { status: 200 });
        }

        return NextResponse.json({ tareas }, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las tareas:", error);
        return NextResponse.json({ error: "Ocurrió un error al obtener las tareas." }, { status: 500 });
    }
}
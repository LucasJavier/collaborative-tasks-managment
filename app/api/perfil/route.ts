import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns"; // Importar para trabajar con fechas
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ 
            req: request, 
            cookieName: process.env.NODE_ENV === "development" ? 
                        "next-auth.session-token"
                        : "__Secure-next-auth.session-token",
            secret: process.env.NEXTAUTH_SECRET! });

        if (!token || !token.id) {
            return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 });
        }
    
        const userId = token.id;
        const hoy = new Date();
        const comienzoDia = startOfDay(hoy);
        const finDelDia = endOfDay(hoy);

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
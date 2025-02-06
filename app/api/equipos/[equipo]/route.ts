import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params} : { params: Promise<{ equipo: string }> }) {
    try {
        const { equipo } = await params;
        
        const equipoId = parseInt(equipo);

        if (isNaN(equipoId)) {
            return NextResponse.json(
                { error: "El parámetro equipoId es inválido o no se proporcionó." },
                { status: 400 }
            );
        }

        const tareas = await prisma.tarea.findMany({
            where: { equipoId },
            include: {
                usuario: {
                    select: {
                        nombreUsuario: true,
                        id: true,
                    },
                },
            },
        });

        const equipoData = await prisma.equipo.findFirst({
            where: { id: equipoId },
            select: {
                id: true,
                nombre: true,
                creadoEn: true,
                idJefe: true,
            },
        });

        if (!equipoData) {
            return NextResponse.json(
                { error: "El equipo no existe." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            equipo: equipoData,
            tareas,
        });
    } catch (error) {
        console.error("Error al obtener las tareas:", error);
        return NextResponse.json(
            { error: "Ocurrió un error al obtener las tareas." },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params} : { params: Promise<{ equipo: string }> }) {
    try {
        const { equipo } = await params;
        const equipoId = parseInt(equipo);
    
        if (isNaN(equipoId)) {
            return NextResponse.json({ error: "ID de equipo inválido" }, { status: 400 });
        }
        const deletedTeam = await prisma.equipo.delete({
            where: { id: equipoId },
        });

        return NextResponse.json({ message: "Tarea eliminada exitosamente", tarea: deletedTeam });
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar la tarea" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ equipo: string }> }) {
    try {
      const { equipo } = await params;
      const equipoId = parseInt(equipo);
  
      if (isNaN(equipoId)) {
        return NextResponse.json({ error: "ID de equipo inválido" }, { status: 400 });
      }
  
      const { nombre } = await req.json();
  
      if (!nombre || typeof nombre !== "string") {
        return NextResponse.json({ error: "El nombre del equipo es requerido" }, { status: 400 });
      }
  
      const updatedEquipo = await prisma.equipo.update({
        where: { id: equipoId },
        data: { nombre },
      });
  
      return NextResponse.json({ 
        message: "Nombre del equipo actualizado", 
        equipo: {
            ...updatedEquipo,
            creadoEn: updatedEquipo.creadoEn,
             }
        });
    } catch (error) {
      console.error("Error al actualizar el nombre del equipo:", error);
      return NextResponse.json({ error: "Error al actualizar el nombre del equipo" }, { status: 500 });
    }
  }
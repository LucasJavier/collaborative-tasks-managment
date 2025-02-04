import { NextRequest, NextResponse } from "next/server"; 
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ tarea: string }> }) {
    try {
        const { tarea } = await params;
        const tareaId = parseInt(tarea);
    
        if (isNaN(tareaId)) {
        return NextResponse.json({ error: "ID de tarea inválido" }, { status: 400 });
        }

        const task = await prisma.tarea.findUnique({
            where: { id: tareaId },
            include: { 
                comentarios: { include: { usuario: true } }, 
                usuario: { select: { id: true } }
            }, 
        });

        if(!task) {
            return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
        }
        const { comentarios, ...tareas } = task;
            
        return NextResponse.json({
            tareas,
            comentarios,
        });
    } catch (error) {
    return NextResponse.json({ error: "Error al recuperar la tarea" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params} : { params: Promise<{ tarea: string }> }) {
    try {
        const { tarea } = await params;
        const tareaId = parseInt(tarea);
        if (isNaN(tareaId)) {
            return NextResponse.json({ error: "ID de tarea inválido" }, { status: 400 });
        }
        const { completada } = await req.json();

        if (typeof completada !== "boolean") {
            return NextResponse.json({ error: "El campo 'completada' debe ser un valor booleano" }, { status: 400 });
        }

        const updatedTask = await prisma.tarea.update({
            where: { id: tareaId },
            data: { completada },
            include: { 
                comentarios: { include: { usuario: true } }, 
                usuario: { select: { id: true } }
            }, 
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar la tarea" }, { status: 500 });
    }

}

export async function POST(req: NextRequest, { params} : { params: Promise<{ tarea: string }> }) {
    try {
        const { tarea } = await params;
        const tareaId = parseInt(tarea);
        if (isNaN(tareaId)) {
            return NextResponse.json({ error: "ID de tarea inválido" }, { status: 400 });
        }
        
        const { textoComentario, usuarioId } = await req.json();  

        if (!textoComentario || typeof textoComentario !== "string") {
            return NextResponse.json({ error: "Comentario inválido" }, { status: 400 });
        }

        const newComentario = await prisma.comentarios.create({
            data: {
                usuarioId,
                tareaId,
                comentario: textoComentario,
            },
            include: { usuario: true }, 
        });

        return NextResponse.json(newComentario, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error al agregar el comentario" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params} : { params: Promise<{ tarea: string }> }) {
    try {
        const { tarea } = await params;
        const tareaId = parseInt(tarea);
    
        if (isNaN(tareaId)) {
            return NextResponse.json({ error: "ID de tarea inválido" }, { status: 400 });
        }
        
        const deletedTask = await prisma.tarea.delete({
            where: { id: tareaId },
        });

        return NextResponse.json({ message: "Tarea eliminada exitosamente", tarea: deletedTask });
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar la tarea" }, { status: 500 });
    }
}
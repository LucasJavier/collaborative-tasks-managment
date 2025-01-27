import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function PATCH(req: NextRequest, { params }: { params: { tarea: string; comentario: string } }) {
    try {
        const { comentario } = params;
        const comentarioId = parseInt(comentario);

        if (isNaN(comentarioId)) {
            return NextResponse.json({ error: "ID de comentario inválido" }, { status: 400 });
        }

        const { comentarioEditado } = await req.json();

        if(!comentarioEditado || typeof comentarioEditado !== "string") {
            return NextResponse.json({ error: "Comentario inválido" }, { status: 400 });
        }

        const newComentario = await prisma.comentarios.update({
            where: { id: comentarioId},
            data: { 
                comentario: comentarioEditado,
                fechaComentario: new Date() 
            },
            include: { usuario: true}, 
        });

        return NextResponse.json(newComentario, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error al modificar el comentario" }, { status: 500 });
    }  
}

export async function DELETE(req: NextRequest, context: { params: { tarea: string; comentario: string } }) {
    try {
        const { comentario } = await context.params;
        const comentarioId = parseInt(comentario);

        if (isNaN(comentarioId)) {
            return NextResponse.json({ error: "ID de comentario inválido" }, { status: 400 });
        }

        const comentarioEliminado = await prisma.comentarios.delete({
            where: { id: comentarioId }
        });

        return NextResponse.json({ mensaje: "Comentario eliminado correctamente", comentarioEliminado }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar el comentario" }, { status: 500 });
    }
}
"use client";

import { Tarea } from "@/app/tipos";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface TareaCardProps {
  tarea: Tarea;
  onDelete: (tareaId: number) => void;
  equipoId: number;
}

export default function TareaCard({ tarea, onDelete, equipoId}: TareaCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleEliminarTarea = async () => {
    try {
      const response = await fetch(`/api/tareas/${tarea.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al borrar la tarea");
      onDelete(tarea.id as number);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  if (status === "loading") return <div>Cargando...</div>;
  if (!session) return <div>No estás autenticado</div>;

  const fechaLimite = new Date(tarea.fechaLimite);
  const ahora = new Date();
  const fechaLimiteColor = fechaLimite <= ahora ? "text-red-500" : "text-green-500";

  const prioridadColor =
    tarea.prioridad === "baja" ? 
    "text-green-500" : tarea.prioridad === "media" ? 
    "text-yellow-500" : "text-red-500";

  const completadaColor = tarea.completada ? "text-green-500" : "text-red-500";

  const fechaLimiteFormateada = format(fechaLimite, "dd MMMM yyyy, HH:mm:ss", { locale: es });

  return (
    <div className="p-6 bg-eerieBlack shadow-md rounded flex flex-col">
      <h3 className="text-lg font-bold mb-2 text-center">{tarea.titulo}</h3>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between text-sm text-white">
          <p>
            Completada: <span className={completadaColor}>{tarea.completada ? "Sí" : "No"}</span>
          </p>
          <p>
            Fecha límite: <span className={fechaLimiteColor}>{fechaLimiteFormateada}</span>
          </p>
        </div>
        <div className="flex justify-between text-sm text-white">
          <p>
            Prioridad: <span className={prioridadColor}>{tarea.prioridad}</span>
          </p>
          <p>
            Creado por: <span className="text-gray-300">{tarea.usuario?.nombreUsuario}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-3 mt-4">
        <button
          onClick={() => router.push(`/perfil/equipos/${equipoId}/${tarea.id}`)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out transform"
        >
          Ver tarea
        </button>
        {((tarea.usuarioIdCreo === Number(session?.user?.id)) || (session?.user?.rolId === 2)) ? (
          <button
            onClick={handleEliminarTarea}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400 transition duration-300 ease-in-out transform"
          >
            Eliminar tarea
          </button>
        ) : null}
      </div>
    </div>
  );
}
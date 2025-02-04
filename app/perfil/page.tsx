"use client"

import { format } from "date-fns"; 
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Tarea } from "../tipos";
import Link from "next/link";

export default function PerfilPage() {
  const [tareas, setTarea] = useState<Tarea[]>([]);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const response = await fetch("/api/perfil");
        if (!response.ok) throw new Error("Error al cargar las tareas");
        const data = await response.json();
        const { tareas = [] } = data;
        setTarea(tareas);
      } catch (err: any) {
        console.error("Error al cargar las tareas:", err);
      }
    };

    fetchTareas();
  }, []);

  const fechaActual = new Date();
  const fechaFormateada = format(fechaActual, "MMMM dd, EEEE", { locale: es });

  const obtenerColorPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'baja':
        return 'text-green-500';
      case 'media':
        return 'text-yellow-500';
      case 'alta':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };

  const obtenerColorCompletada = (completada: boolean) => {
    return completada ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4">Hoy</h1>
      <p className="mb-4">{fechaFormateada}</p>

      {tareas.length > 0 ? (
        <div className="space-y-4">
          {tareas.map((tarea) => (
            <div
              key={tarea.id}
              className="flex flex-col border border-white bg-transparent p-3 rounded-lg shadow-md"
            >
              <h2 className="text-lg font-bold text-center">{tarea.titulo}</h2>
              <div className="mt-2">
                <div className="flex justify-between mb-2">
                  <p><strong className="text-sm text-white">Completada: </strong> 
                    <span className={obtenerColorCompletada(tarea.completada || false)}>
                      {tarea.completada ? "Sí" : "No"}
                    </span>
                  </p>
                  <p><strong className="text-sm text-white">Prioridad: </strong> 
                    <span className={obtenerColorPrioridad(tarea.prioridad)}>
                      {tarea.prioridad}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <p><strong className="text-sm text-white">Equipo:</strong> {tarea.equipo?.nombre}</p>
                  <p><strong className="text-sm text-white">Creado por:</strong> {tarea.usuario?.nombreUsuario}</p>
                </div>
              </div>
              <div className="mt-3 text-center">
                <Link
                  href={`/perfil/equipos/${tarea.equipo?.id}/${tarea.id}`}
                  className="inline-block w-full px-6 py-2 text-blue-500 border border-blue-500 rounded-md bg-transparent hover:text-white hover:bg-blue-500 transition duration-300 ease-in-out"
                >
                  Ver tarea
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No tienes tareas para hoy.</p>
      )}
    </div>
  );
}
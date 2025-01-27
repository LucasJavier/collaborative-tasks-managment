"use client";

import { Tarea } from "@/app/tipos";
import TareaCard from "@/componentes/TareaCard";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import NuevaTarea from "@/componentes/NuevaTarea";
import { useSession } from "next-auth/react";
import { useModal } from "@/app/contexto/modalContexto";
import { useRouter } from "next/navigation";

interface Equipo {
  id: number;
  nombre: string;
  creadoEn: string;
}

export default function EquipoPage({ params }: { params: { equipo: string } }) {
  const [tareas, setTarea] = useState<Tarea[]>([]);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [idEquipo, setIdEquipo] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const { isModalOpen, toggleModal } = useModal();
  const router = useRouter();

  useEffect(() => {
    const unwrapParams = async () => {
      const id = await params;
      setIdEquipo(id.equipo);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!idEquipo) return; 
    const middlewareEquipo = async () => {
      try {
        const response = await fetch(`/api/equipos/${idEquipo}/middleware`);
        if (!response.ok) router.push("/auth/noAutorizado");
      } catch (err: any) {
        setError(err.message);
      }
    };
    middlewareEquipo();
  }, [idEquipo]);

  useEffect(() => {
    if (!idEquipo) return;

    const fetchEquipo = async () => {
      try {
        const response = await fetch(`/api/equipos/${idEquipo}`);
        if (!response.ok) throw new Error("Error al cargar los equipos");
        const data = await response.json();
        const { equipo, tareas } = data;
        setTarea(tareas);
        setEquipo(equipo);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchEquipo();
  }, [idEquipo]);

  const handleCrearTarea = async (tarea: Tarea) => {
    try {
      const response = await fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarea),
      });
      if (!response.ok) throw new Error("Error al crear la tarea");
      const nuevaTarea = await response.json();
      setTarea((prevTareas) => [...prevTareas, nuevaTarea]);
      !isModalOpen;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEliminarTarea = (tareaId: number) => {
    setTarea((prevTareas) => prevTareas.filter((tarea) => tarea.id !== tareaId));
  };

  if (error) return <p>Error: {error}</p>;
  if (!equipo) return <p>Cargando equipo...</p>;
  if (status === "loading") return <div>Cargando...</div>;
  if (!session) return <div>No estás autenticado</div>;

  const fechaCreacion = format(new Date(equipo.creadoEn), "dd MMMM yyyy, HH:mm:ss", { locale: es });

  return (
    <div className="p-6 flex-1">
      <h1 className="text-2xl font-bold">{equipo.nombre}</h1>
      <p className="mb-4">Creado en {fechaCreacion}</p>
      <h2 className="text-xl font-bold mt-6">Tareas</h2>

      {tareas.length > 0 ? (
        <div className="relative mt-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
            {tareas.map((tarea) => (
              <TareaCard key={tarea.id} tarea={tarea} onDelete={handleEliminarTarea} equipoId={equipo.id}/>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p>Sin tareas de momento</p>
        </div>
      )}

      {isModalOpen && idEquipo !== null && (
        <NuevaTarea
          onClose={toggleModal}
          onSave={handleCrearTarea}
          equipoId={parseInt(idEquipo)}
          usuarioId={session.user?.id ?? ""}
        />
      )}
    </div>
  );
}
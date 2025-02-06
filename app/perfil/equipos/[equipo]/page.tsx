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
import Image from "next/image";

interface Equipo {
  id: number;
  nombre: string;
  creadoEn: string;
  idJefe: Number;
}

export default function EquipoPage({ params }: { params: Promise<{ equipo: string }> }) {
  const [tareas, setTarea] = useState<Tarea[]>([]);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [idEquipo, setIdEquipo] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const { isModalOpen, toggleModal } = useModal();
  const router = useRouter();
  const [nombreEquipo, setNombreEquipo] = useState<string>(''); 
  const [modalNombreEquipo, setModalNombreEquipo] = useState<Boolean>(false);

  useEffect(() => {
    const unwrapParams = async () => {
      const { equipo }  = await params;
      setIdEquipo(equipo);
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
        if (!response.ok) throw new Error("Error al cargar el equipos");
        const data = await response.json();
        const { equipo, tareas } = data;
        setTarea(tareas);
        setEquipo(equipo);
        setNombreEquipo(equipo.nombre);
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
      toggleModal();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEliminarTarea = (tareaId: number) => {
    setTarea((prevTareas) => prevTareas.filter((tarea) => tarea.id !== tareaId));
  };

  const handleCambiarNombreEquipo = async () => {
    try {
      const response = await fetch(`/api/equipos/${idEquipo}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: nombreEquipo }), // Enviar el nuevo nombre
      });
      if (!response.ok) throw new Error("Error al actualizar el nombre del equipo");
      const { equipo: updatedEquipo } = await response.json();
      setEquipo(updatedEquipo);
      setModalNombreEquipo(false); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!equipo) return <p>Cargando equipo...</p>;
  if (status === "loading") return <div>Cargando...</div>;
  if (!session) return <div>No estás autenticado</div>;

  const fechaCreacion = format(new Date(equipo.creadoEn), "dd MMMM yyyy, HH:mm:ss", { locale: es });
  const { user } = session!;

  return (
    <div className="p-6 flex-1">
      {Number(user.id) === equipo.idJefe ? (
        <div className="flex justify-between items-center relative">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{equipo.nombre}</h1>
            <div
              className="p-1 rounded hover:bg-green-400 hover:bg-opacity-50 transition duration-200 cursor-pointer"
              onClick={() => setModalNombreEquipo(true)}
            >
              <Image
                src="/images/edit-50.png"
                alt="Editar nombre de equipo"
                width={20}
                height={20}
                className="filter invert brightness-0"
              />
            </div>
          </div>
        <button
          onClick={() => router.push(`/perfil/equipos/${idEquipo}/usuarios/`)}
          className="border border-blue-500 text-blue-500 rounded-full px-4 py-2 transition-colors hover:bg-blue-500 hover:text-white"
        >
          Ver usuarios de tu equipo
        </button>
      </div>
      ) : <h1 className="text-2xl font-bold">{equipo.nombre}</h1>}
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

      {modalNombreEquipo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-slate-800 p-6 rounded-md w-96 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-white">Editar nombre del equipo</h2>
            <input
              type="text"
              value={nombreEquipo}
              onChange={(e) => setNombreEquipo(e.target.value)} 
              className="border border-gray-300 p-2 w-full mb-4 text-black"
            />
            <button
              onClick={handleCambiarNombreEquipo}
              className="bg-green-300 text-black px-4 py-2 rounded-full hover:bg-green-500"
            >
              Guardar cambios
            </button>
            <button
              onClick={() => setModalNombreEquipo(false)}
              className="ml-4 bg-red-300 text-black px-4 py-2 rounded-full hover:bg-red-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
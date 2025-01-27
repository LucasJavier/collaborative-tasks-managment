"use client";

import { useEffect, useState } from "react";
import { Equipo } from "@/app/tipos";
import EquipoCard from "@/componentes/EquipoCard";
import { useRouter } from "next/navigation";

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch("/api/equipos");
        if (!response.ok) throw new Error("Error al cargar los equipos");
        const data = await response.json();
        setEquipos(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchEquipos();
  }, []);

  const handleUniserEquipo = () => {
    router.push("/perfil/equipos/unirse");
  };

  const handleEliminarEquipo = (equipoId: number) => {
    setEquipos((prevEquipos) => prevEquipos.filter((equipo) => equipo.id !== equipoId));
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 flex-1">
      {equipos.length !== 0 ? (
        <>
          <h1 className="text-2xl font-bold mb-4 text-center">
            Equipos en los que estás unido
          </h1>
          <div className="grid grid-cols-1 gap-4">
            {equipos.map((equipo) => (
              <EquipoCard
                key={equipo.id}
                idEquipo={equipo.id}
                nombreEquipo={equipo.nombre}
                creadoEn={equipo.creadoEn}
                idJefe={equipo.idJefe}
                nombreJefe={equipo.usuarioJefe.nombreUsuario}
                onDelete={handleEliminarEquipo}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center mt-16">
          <p className="text-lg font-semibold mb-4">
            No estás en ningún equipo de momento
          </p>
          <button
            onClick={handleUniserEquipo}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:scale-105 transition-transform duration-200"
          >
            ¡Unirse a un equipo!
          </button>
        </div>
      )}
    </div>
  );
}
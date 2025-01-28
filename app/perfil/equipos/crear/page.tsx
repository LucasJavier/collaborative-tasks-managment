"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import EquipoEnlace from "@/componentes/EquipoEnlace";

export default function CrearEquipo() {
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codigoInvitacion, setCodigoInvitacion] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const handleSubmit = async () => {
    setError("");
    if (!nombreEquipo.trim()) {
      setError("Por favor, ingresa un nombre para el equipo.");
      return;
    }

    try {
      setLoading(true);

      const usuarioId = session.user?.id;
      if (!usuarioId) {
        setError("No se pudo obtener la información del usuario.");
        return;
      }

      const response = await fetch("/api/equipos/crear-equipo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: nombreEquipo, idJefe: usuarioId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear el equipo.");
      }

      setCodigoInvitacion(data.codigoInvitacion);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al crear el equipo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="bg-gray-300 p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Crear un Equipo</h1>
        <input
          type="text"
          value={nombreEquipo}
          onChange={(e) => setNombreEquipo(e.target.value)}
          placeholder="Nombre del equipo"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full p-2 text-white rounded ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {loading ? "Creando equipo..." : "Crear equipo"}
        </button>
        {codigoInvitacion && (
          <div className="mt-4">
            <EquipoEnlace codigoInvitacion={codigoInvitacion} textoCreado={true} />
          </div>
        )}
      </div>
    </div>
  );
}
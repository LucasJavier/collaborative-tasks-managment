import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateTime } from "next-auth/providers/kakao";
import { useSession } from "next-auth/react";
import { useState } from "react";
import EquipoEnlace from "./EquipoEnlace";
import ConfirmarEliminarModal from "./EliminarModal";

export default function EquipoCard({ idEquipo, nombreEquipo, creadoEn, idJefe, nombreJefe, onDelete }:
  { idEquipo: number; nombreEquipo: string; creadoEn: DateTime; idJefe: number; nombreJefe: string; 
    onDelete: (equipoId: number) => void }) {

  const { data: session, status } = useSession();
  const [codigoInvitacion, setCodigoInvitacion] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const [mostrarModal, setMostrarModal] = useState<boolean>(false)

  const fechaCreacion = format(new Date(creadoEn), "EEEE dd 'de' MMMM, 'a las' HH:mm", { locale: es });

  const handleEliminarEquipo = async () => {
    try {
      const response = await fetch(`/api/equipos/${idEquipo}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al borrar el equipo");
      onDelete(idEquipo);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  const handleGenerarCodigo = async () => {
    setError("");
    try {
      setLoading(true);

      const response = await fetch("/api/equipos/crear-equipo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({idEquipo}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear el código.");
      }

      setCodigoInvitacion(data.codigoInvitacion);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al crear el código.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div>Cargando...</div>;
  if (!session) return <div>No estás autenticado</div>;

  return (
    <div className="border p-4 mb-2 w-full rounded-2xl relative">
      
      <div className="relative group"> 
        {((idJefe === Number(session.user.id)) || (session.user.rolId === 2)) && (
          <div 
            className="absolute top-2 right-2 cursor-pointer opacity-90 hover:brightness-0 hover:grayscale hover:rounded-xl transition duration-300"
            onClick={() => setMostrarModal(true)}
          >
            <Image
              src="/images/x-50.png"
              alt="Eliminar equipo"
              width={20} 
              height={20} 
              className="filter invert"
            />
          </div>
        )}
        <span className="absolute top-4 right-7 transform -translate-y-1/2 mr-2 text-sm text-white opacity-0 group-hover:opacity-100 transition duration-300">
          Eliminar equipo
        </span>
      </div>

      <ConfirmarEliminarModal
        abrirModal={mostrarModal}
        elemento="equipo"
        mensaje={
          <>
            ¿Seguro que deseas eliminar el equipo <span className="text-green-500 font-bold">"{nombreEquipo}"</span>
            ? Esta acción no se puede deshacer.
          </>
        }
        confirmar={() => {
          handleEliminarEquipo();
          setMostrarModal(false);
        }}
        cancelar={() => setMostrarModal(false)}
      />
      
      <h2 className="text-lg font-bold text-center">{nombreEquipo}</h2>
      <p className="text-sm text-white">{`Creado el: `}<span className="text-gray-300">{fechaCreacion}</span></p>
      <p className="text-sm text-white">{`Creado por: `}<span className="text-gray-300">{nombreJefe}</span></p>
      <button
        onClick={() => window.location.href = `/perfil/equipos/${idEquipo}`} 
        className="mt-4 w-full py-2 border-2 border-blue-500 text-blue-500 rounded-2xl hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out transform"
      >
        Ver tareas
      </button>
      {((idJefe === Number(session.user.id)) || (session.user.rolId === 2)) && (
        <>
          <button
            onClick={handleGenerarCodigo}
            disabled={loading}
            className={`w-full p-2 mt-4 border-2 border-blue-400 text-white rounded-2xl ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {loading ? "Creando código..." : "Crear código de invitación"}
          </button>
        {codigoInvitacion && (
          <div className="mt-4">
            <EquipoEnlace codigoInvitacion={codigoInvitacion} textoCreado={false} />
          </div>
        )}
        </>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Tarea, Comentario } from '@/app/tipos';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useSession } from "next-auth/react";
import ComentarioCard from '@/componentes/ComentarioCard'; 

export default function TareaPage({ params }: { params: { equipo: string; tarea: string } }) {
  const [idTarea, setIdTarea] = useState<string | null>(null);
  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [idEquipo, setEquipo] = useState<number>(NaN);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [textoComentario, setTextoComentario] = useState<string>(""); 
  const [comentarioEditado, setComentarioEditado] = useState<string>(""); 
  const [comentarioIdEditado, setComentarioIdEditado] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const unwrapParams = async () => {
      const {equipo, tarea} = await params;
      if (!equipo || !tarea) {
        setError("Parámetros inválidos");
        return;
      }
      setEquipo(parseInt(equipo));
      setIdTarea(tarea);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!idTarea) return; 
    const middlewareEquipo = async () => {
      try {
        const response = await fetch(`/api/equipos/${idEquipo}/middleware`);
        if (!response.ok) router.push("/auth/noAutorizado");
      } catch (err: any) {
        setError(err.message);
      }
    };
    middlewareEquipo();
  }, [idTarea]);

  useEffect(() => {
    if (!idTarea) return; 

    const fetchTarea = async () => {
      try {
        const response = await fetch(`/api/tareas/${idTarea}`);
        if (!response.ok) throw new Error("Error al cargar la tarea");
        const data = await response.json();
        const { tarea, comentarios } = data;
        setTarea(tarea); 
        setComentarios(comentarios); 
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchTarea();
  }, [idTarea]);

  const handleMarcarCompletada = async () => {
    if (!tarea) return; 
    try {
      const response = await fetch(`/api/tareas/${idTarea}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completada: !tarea?.completada }),
      });
      if (!response.ok) throw new Error("Error al actualizar la tarea");
      const data = await response.json();
      setTarea(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAgregarComentario = async () => {
    if (!textoComentario.trim()) return; 
    if (!session || !session.user?.id) {
      setError("No se ha encontrado el usuario en la sesión");
      return;
    }
    try {
      const response = await fetch(`/api/tareas/${idTarea}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textoComentario, usuarioId: session.user?.id }),
      });
      if (!response.ok) throw new Error("Error al agregar el comentario");
      setTextoComentario("");
      const nuevoComentario = await response.json();
      setComentarios((prevComentarios) => [...prevComentarios, nuevoComentario]); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditarComentario = async (comentarioIdEditado: number, texto: string) => {
    setComentarioEditado(texto);
    setComentarioIdEditado(comentarioIdEditado);
  };

  const handleCancelarEdicion = () => {
    setComentarioEditado("");
    setComentarioIdEditado(null);
  }

  const handleGuardarComentarioEditado = async () => {
    if (!comentarioEditado.trim()) return; 

    try {
      const response = await fetch(`/api/tareas/${idTarea}/${comentarioIdEditado}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentarioEditado }),
      });
      if (!response.ok) throw new Error("Error al actualizar el comentario");
      const comentarioActualizado = await response.json();
      setComentarios((prevComentarios) =>
        prevComentarios.map((comentario) =>
          comentario.id === comentarioIdEditado ? comentarioActualizado : comentario
        )
      );
      setComentarioEditado("");
      setComentarioIdEditado(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBorrarComentario = async (idComentario: number) => {
    try {
      const response = await fetch(`/api/tareas/${idTarea}/${idComentario}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al borrar el comentario");
      setComentarios((prevComentarios) =>
        prevComentarios.filter((comentario) => comentario.id !== idComentario)
      );
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (error) return <p>Error: {error}</p>;
  if (!tarea) return <p>Cargando tarea...</p>;
  if (status === "loading") return <div>Cargando...</div>;
  if (!session) return <div>No estás autenticado</div>;

  const fechaLimite = new Date(tarea.fechaLimite);
  const ahora = new Date();
  const fechaLimiteColor = fechaLimite <= ahora ? "text-red-500" : "text-green-500";
  const fechaLimiteFormateada = format(fechaLimite, "PPPP, HH:mm", { locale: es });

  const completadaColor = tarea.completada ? "text-green-500" : "text-red-500";

  const prioridadColor =
    tarea.prioridad === "baja" ? 
    "text-green-500" : tarea.prioridad === "media" ? 
    "text-yellow-500" : "text-red-500";
  
  return (
    <div className="p-6 flex-1">
      <h1 className="text-2xl font-bold">{tarea.titulo}</h1>
      <p className="text-gray-300 mb-4">{tarea.descripcion || "Sin descripción"}</p>
      <p><strong>Prioridad: </strong> <span className={prioridadColor}>{tarea.prioridad}</span></p>
      <p><strong>Fecha Límite: </strong><span className={fechaLimiteColor}>{fechaLimiteFormateada}</span></p>
      <p><strong>Estado: </strong> <span className={completadaColor}>{tarea.completada ? "Completada" : "Pendiente"}</span></p>
      {((tarea.usuarioIdCreo === Number(session?.user?.id)) || (session?.user?.rolId === 2)) && (
        <button 
        onClick={handleMarcarCompletada} 
        className={`px-4 py-2 mt-4 ${tarea.completada ? "bg-green-500" : "bg-red-500"} text-white rounded`}
      >
        {tarea.completada ? "Marcar como pendiente" : "Marcar como completada"}
      </button>
      )}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Comentarios</h2>
        <textarea
          value={textoComentario}
          onChange={(e) => setTextoComentario(e.target.value)}
          className="w-full mt-2 p-2 border rounded text-black"
          rows={4}
          placeholder="Escribe tu comentario..."
        />
        <button
          onClick={handleAgregarComentario}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Agregar comentario
        </button>

        <div className="mt-4">
          {comentarios.map((comentario) => (
            <div key={comentario.id} className="mb-4">
              {comentarioIdEditado !== comentario.id ? (
                comentario.fechaComentario && comentario.usuario ? (
                  <ComentarioCard 
                    comentario={comentario.comentario}
                    fechaComentario={comentario.fechaComentario} 
                    usuario={comentario.usuario}
                    id={comentario.id}
                    comentarioUsuarioId={comentario.usuarioId ?? NaN}
                    sesionActualId={session.user.id ?? ""}
                    idEditado={comentarioIdEditado ?? NaN}
                    sesionRolId={session.user.rolId}
                    onEdit={() => handleEditarComentario(comentario.id, comentario.comentario)}
                    onDelete={() => handleBorrarComentario(comentario.id)}
                  />
                ) : ( 
                  <p className="text-red-500">Comentario incompleto o con datos faltantes</p>
                )
              ) : null}

              {comentarioIdEditado === comentario.id && (
                <div>
                  <textarea
                    value={comentarioEditado}
                    onChange={(e) => setComentarioEditado(e.target.value)}
                    className="w-full p-2 border rounded text-black"
                    rows={4}
                    placeholder="Edita tu comentario..."
                  />
                  <button
                    onClick={handleGuardarComentarioEditado}
                    className="mt-2 mb-2 mr-2 px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Guardar comentario
                  </button>
                  <button
                    onClick={handleCancelarEdicion}
                    className="mt-2 mb-2 px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Usuario {
  id: number;
  nombreUsuario: string;
  email: string;
}

export default function UsuariosEquipoPage({ params }: { params: Promise<{ equipo: string }> }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [idEquipo, setIdEquipo] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

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

    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`/api/equipos/${idEquipo}/usuarios`);
        if (!response.ok) throw new Error("Error al cargar los usuarios");
        const data = await response.json();
        setUsuarios(data.usuarios);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchUsuarios();
  }, [idEquipo]);

  const handleEliminarUsuario = async (usuarioId: number) => {
    try {
      const response = await fetch(`/api/equipos/${idEquipo}/usuarios`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuarioId }),
      });

      if (!response.ok) throw new Error("Error al eliminar usuario");
      setUsuarios((prevUsuario) => prevUsuario.filter((usuario) => usuario.id !== usuarioId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!session) return <p>Cargando...</p>;
  const { user } = session!;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Usuarios en el equipo</h1>
      <div className="space-y-4">
        {usuarios.map((usuario) => 
            (usuario.id !== Number(user.id)) && (
                <div key={usuario.id} className="flex justify-between gap-2 items-center bg-gray-100 p-4 rounded-full shadow">
                    <span className="text-lg font-semibold text-blue-900">{usuario.nombreUsuario}</span>
                    <span className="text-gray-600">{usuario.email}</span>
                    <div
                        className="p-1 rounded hover:bg-red-500 hover:bg-opacity-50 transition duration-200 cursor-pointer"
                        onClick={() => handleEliminarUsuario(usuario.id)}
                    >
                        <Image src="/images/delete-user-50.png" alt="Eliminar usuario" width={20} height={20} />
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
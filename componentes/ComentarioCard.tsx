import { Usuario } from "@/app/tipos";
import { format } from "date-fns";
import { es } from "date-fns/locale"; 
import { DateTime } from "next-auth/providers/kakao";
import Image from "next/image";

interface ComentarioCardProps {
  comentario: string;
  fechaComentario: DateTime;
  usuario: Usuario;
  onEdit: () => void;
  onDelete: () => void;
  id: number;
  idEditado: number;
  comentarioUsuarioId: number;
  sesionActualId: string;
  sesionRolId: number;
}

export default function ComentarioCard(comentario: ComentarioCardProps) {
  const fechaFormateada = format(new Date(comentario.fechaComentario), "PPP, HH:mm", { locale: es });

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md relative">
      <h3 className="font-semibold text-lg text-black">{comentario.usuario.nombreUsuario}</h3>
      <p className="text-gray-700">{comentario.comentario}</p>
      <p className="text-gray-500 text-sm mt-2">{fechaFormateada}</p>
      {comentario.comentarioUsuarioId === Number(comentario.sesionActualId) ? (
        <>
          <div
            className="absolute top-2 right-10 p-1 rounded hover:bg-green-400 hover:bg-opacity-50 transition duration-200 cursor-pointer"
            onClick={comentario.onEdit}
          >
            <Image
              src="/images/edit-50.png"
              alt="Editar comentario"
              width={20}
              height={20}
            />
          </div>
          <div
            className="absolute top-2 right-2 p-1 rounded hover:bg-red-500 hover:bg-opacity-50 transition duration-200 cursor-pointer"
            onClick={comentario.onDelete}
          >
            <Image
              src="/images/delete-48.png"
              alt="Borrar comentario"
              width={20}
              height={20}
            />
          </div>
        </>
      ) : comentario.sesionRolId === 2 ? (
        <div
          className="absolute top-2 right-2 p-1 rounded hover:bg-red-500 hover:bg-opacity-50 transition duration-200 cursor-pointer"
          onClick={comentario.onDelete}
        >
          <Image
            src="/images/delete-48.png"
            alt="Borrar comentario"
            width={20}
            height={20}
          />
        </div>
      ) : null}
    </div>
  );
}
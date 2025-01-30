"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import BotonAñadir from "@/componentes/botonAñadir";
import { useModal } from "@/app/contexto/modalContexto";

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentPath = usePathname();
  const { toggleModal } = useModal();

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }
  const { user } = session;

  const isEquipoPage = currentPath.startsWith('/perfil/equipos/') && 
                    currentPath.split('/').filter(Boolean).length === 3 && 
                    !currentPath.includes('/crear') && 
                    !currentPath.includes('/unirse');


  return (
    <div className="flex-1 grid grid-cols-4 h-screen">
      <nav className="col-span-1 bg-eerieBlack p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Hola, {user?.name}!</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 w-full">
            <Image
              src="/images/today-50.png"
              alt="Hoy"
              width={20}
              height={20}
              className="filter invert brightness-100"
            />
            <button
              onClick={() => router.push("/perfil")}
              className="text-white hover:underline bg-transparent hover:bg-gray-600 p-2 rounded w-full text-left"
            >
              Hoy
            </button>
          </li>
          <li className="flex items-center gap-2 w-full">
            <Image
              src="/images/create-50.png"
              alt="Crear Equipo"
              width={20}
              height={20}
              className="filter invert brightness-100"
            />
            <button
              onClick={() => router.push("/perfil/equipos/crear")}
              className="text-white hover:underline bg-transparent hover:bg-gray-600 p-2 rounded w-full text-left"
            >
              Crear Equipo
            </button>
          </li>
          <li className="flex items-center gap-2 w-full">
            <Image
              src="/images/join-48.png"
              alt="Unirse a Equipo"
              width={20}
              height={20}
              className="filter invert brightness-100"
            />
            <button
              onClick={() => router.push("/perfil/equipos/unirse")}
              className="text-white hover:underline bg-transparent hover:bg-gray-600 p-2 rounded w-full text-left"
            >
              Unirse a Equipo
            </button>
          </li>
          <li className="flex items-center gap-2 w-full">
            <Image
              src="/images/view-50.png"
              alt="Ver Equipos"
              width={20}
              height={20}
              className="filter invert brightness-100"
            />
            <button
              onClick={() => router.push("/perfil/equipos")}
              className="text-white hover:underline bg-transparent hover:bg-gray-600 p-2 rounded w-full text-left"
            >
              Ver Equipos en los que estás unido
            </button>
          </li>
        </ul>
        {isEquipoPage && (
          <div className="mt-4"> 
            <BotonAñadir onClick={toggleModal} />
          </div>
        )}
      </nav>
      <main className="col-span-3 bg-zinc-800 p-8 overflow-y-auto flex">
        {children}
      </main>
    </div>
  );
}
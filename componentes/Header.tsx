"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SignOut from "@/componentes/auth/SignOut";

export default function Header() {
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";

  return (
    <header className="bg-gray-800 p-4 flex flex-row justify-between">
      <div className="m-4 flex flex-row gap-4 items-center">
        <Image
          src="/images/icon-checklist-100x100.png"
          alt="Task Manager Logo"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <Link href="/" className="text-white text-xl font-bold">
          Task Manager
        </Link>
      </div>
      <div className="m-4 flex flex-row gap-4 items-center">
        {!isLoggedIn ? (
          <>
            <Link
              href="/auth/login"
              className="text-white border border-gray-500 rounded px-4 py-1 transition-all duration-200 hover:border-gray-300 hover:bg-gray-700 bg-green-600"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/registro"
              className="text-white border border-gray-500 rounded px-4 py-1 transition-all duration-200 hover:border-gray-300 hover:bg-gray-700 bg-amber-700" 
            >
              Registrarse
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/perfil"
              className="text-white border border-gray-500 rounded px-4 py-1 transition-all duration-200 hover:border-gray-300 hover:bg-gray-700"
            >
              Perfil
            </Link>
            <Link
              href="/perfil/equipos"
              className="text-white border border-gray-500 rounded px-4 py-1 transition-all duration-200 hover:border-gray-300 hover:bg-gray-700"
            >
              Mis Equipos
            </Link>
            <div className="text-white border border-gray-500 rounded px-4 py-1 transition-all duration-200 hover:border-gray-300 hover:bg-gray-700">
              <SignOut />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
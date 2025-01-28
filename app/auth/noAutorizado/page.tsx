"use client";

import { useRouter } from "next/navigation";

export default function NoAutorizado() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso No Autorizado</h1>
      <p className="text-lg text-white mb-6">
        No tienes permiso para acceder a esta página.
      </p>
      <button
        onClick={handleRedirect}
        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
      >
        Ir al Inicio
      </button>
    </div>
  );
}
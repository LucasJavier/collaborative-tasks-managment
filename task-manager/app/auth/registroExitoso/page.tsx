"use client";

import { useRouter } from "next/navigation";

export default function RegistroExitoso() {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-700">
      <div className="w-96 p-6 bg-eerieBlack shadow-md rounded text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">
          ¡Registro exitoso!
        </h1>
        <p className="mb-4 text-white">
          Tu cuenta ha sido creada con éxito. Ya puedes acceder a tu perfil.
        </p>
        <button
          onClick={() => router.push("/perfil")}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Ir a mi perfil
        </button>
      </div>
    </div>
  );
}
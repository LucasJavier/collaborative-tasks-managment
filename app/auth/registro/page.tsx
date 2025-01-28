"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registroSchema } from "@/lib/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";

export default function Login() {
  const [error, setError] = useState("");
  const [registroData, setRegistroData] = useState({
    nombre: "",
    apellido: "",
    nombreUsuario: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      registroSchema.parse(registroData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message);
        return;
      }
    }

    setLoading(true);

    const res = await fetch("/api/auth/registro", {
      method: "POST",
      body: JSON.stringify(registroData),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      try {
        const data = await res.json();
        const respuesta = await signIn("credentials", {
          usuario_correo: data.usuario.nombreUsuario,
          password: registroData.password,
          redirect: false,
        });
    
        if (!respuesta || respuesta.error) {
          setError(respuesta?.error || "Credenciales inválidas");
        } else {
          router.push("/auth/registroExitoso"); 
        }
      } catch (error) {
        setError("Error procesando la respuesta del servidor.");
      }
    } else {
      try {
        const errorData = await res.json();
        setError(errorData.error || "Ocurrió un error.");
      } catch (err) {
        setError("Error interno del servidor. Intenta nuevamente.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-96 p-6 bg-[rgb(28,27,25)] shadow-md rounded">
        <h1 className="text-xl font-bold mb-4">Registrarse</h1>
        <input
          type="nombre"
          placeholder="Nombre"
          value={registroData.nombre}
          onChange={(e) => setRegistroData({ ...registroData, nombre: e.target.value })}
          className="w-full mb-4 p-2 border rounded text-black"
          required
        />
        <input
          type="apellido"
          placeholder="Apellido"
          value={registroData.apellido}
          onChange={(e) => setRegistroData({ ...registroData, apellido: e.target.value })}
          className="w-full mb-4 p-2 border rounded text-black"
          required
        />
        <input
          type="nombreUsuario"
          placeholder="Nombre de Usuario"
          value={registroData.nombreUsuario}
          onChange={(e) => setRegistroData({ ...registroData, nombreUsuario: e.target.value })}
          className="w-full mb-4 p-2 border rounded text-black"
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={registroData.email}
          onChange={(e) => setRegistroData({ ...registroData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded text-black"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={registroData.password}
          onChange={(e) => setRegistroData({ ...registroData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded text-black"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Creando usuario..." : "Registrarse"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}

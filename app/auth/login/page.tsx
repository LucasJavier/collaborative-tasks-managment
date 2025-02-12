"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GitHubSignIn from "@/componentes/auth/GitHubSignIn";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/lib/zod";
import { z } from "zod";
import Link from "next/link";

export default function Login() {
  const [signUpData, setSignUpData] = useState({ usuario_correo: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      loginSchema.parse(signUpData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message);
        return;
      }
    }

    setLoading(true); 

    const res = await signIn("credentials", {
      usuario_correo: signUpData.usuario_correo,
      password: signUpData.password,
      redirect: false,
    });
    if (!res || res.error) {
      setError("Credenciales inválidas");
    } else {
      router.push("/perfil");
    }

    setLoading(false); 
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen flex-col">
      <form onSubmit={handleSubmit} className="w-96   p-6 bg-[rgb(28,27,25)] shadow-md rounded">
        <h1 className="text-xl font-bold mb-4">Inicia sesión</h1>
        <input
          type="usuario_correo"
          placeholder="Nombre de Usuario o Correo electrónico"
          value={signUpData.usuario_correo}
          onChange={(e) => setSignUpData({ ...signUpData, usuario_correo: e.target.value })}
          className="w-full mb-4 p-2 border rounded text-black"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={signUpData.password}
          onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded text-black"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Buscando usuario..." : "Iniciar sesión"}
        </button>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <p className="text-center text-white mt-4">
            ¿No tienes una cuenta? 
            <Link href="/auth/registro" className="text-blue-500 hover:underline ml-1">
              ¡Regístrate!
            </Link>
        </p>
      </form>
      <section className="bg-transparent p-8 max-w-md w-full text-black flex items-center justify-center">
        <GitHubSignIn />
      </section>
    </div>
  );
}
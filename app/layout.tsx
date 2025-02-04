import "./globals.css";
import Header from "@/componentes/Header";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ModalProvider } from './contexto/modalContexto';

export const metadata = {
  title: "Gestor de Tareas",
  description: "Aplicación de gestión de tareas colaborativa",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="es">
      <body className="w-full min-h-screen flex flex-col bg-gray-700 overflow-x-hidden">
        <SessionProvider session={session}>
          <div className="shadow-xl shadow-white">
            <Header />
          </div>
          <ModalProvider>
            <main className="flex-1 flex justify-center shadow-2xl shadow-white">
              {children}
            </main>
          </ModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
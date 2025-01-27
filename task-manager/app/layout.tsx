import "./globals.css";
import Header from "@/componentes/Header";
import Footer from "@/componentes/Footer";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ModalProvider } from './contexto/modalContexto';

export const metadata = {
  title: "Gestión de Tareas",
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
      <body className="w-full h-screen flex flex-col bg-gray-700 overflow-x-hidden">
        <SessionProvider session={session}>
          <div className="shadow-xl shadow-white">
            <Header />
          </div>
          <ModalProvider>
            <main className="min-h-screen flex-1 flex justify-center shadow-2xl shadow-white">
              {children}
            </main>
          </ModalProvider>
          <div className="shadow-xl shadow-white">
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
import Footer from "@/componentes/Footer";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="grid grid-cols-2 grid-rows-2 gap-4 m-2 h-full relative z-10">
        <div className="bg-transparent w-full h-full flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-bold text-center text-black mb-4 drop-shadow-lg">
            Organiza tus tareas y tus equipos!
          </h1>
          <p className="text-lg text-center text-gray-300 mb-6 drop-shadow-lg">
            Gestiona tus tareas, crea equipos, dale feedback a las tareas y más!
          </p>
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Iniciar sesión
          </Link>
        </div>
        <div className="flex-initial bg-transparent relative overflow-hidden rounded-2xl shadow-lg">
          <Image
            src="/images/task-manager_teams.png"
            alt="Team Task"
            fill
            style={{objectFit: "contain", objectPosition: "center"}}
          />
        </div>
        <div className="flex-initial bg-transparent relative overflow-hidden rounded-2xl shadow-lg">
          <Image
            src="/images/task-manager_tasks.png"
            alt="Team Task"
            fill
            style={{objectFit: "contain", objectPosition: "center"}}
          />
        </div>
        <div className="bg-transparent w-full h-full flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-bold text-center text-white mb-4 drop-shadow-lg">
            Task Manager te permite gestionar mejor tus deberes diarios, solo o en equipo, mucho más fácil!
          </h1>
          <p className="text-lg text-center text-gray-300 mb-4">
            ¿No tienes una cuenta?
          </p>
          <Link
            href="/auth/registro"
            className="bg-green-600 text-white py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Registrate!
          </Link>
        </div>
      </div>

      {/* Aquí se coloca el footer al final y con un z-index bajo */}
      <div className="relative z-0">
        <Footer />
      </div>
    </div>
  );
}
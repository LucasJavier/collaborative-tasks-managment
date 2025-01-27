import { useState } from "react";

export default function EquipoEnlace({ codigoInvitacion, textoCreado }: { 
  codigoInvitacion: string; textoCreado: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codigoInvitacion);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="text-black">
      <p className={`text-lg font-semibold mb-2 ${textoCreado ? "text-gray-900" : "text-white text-center"}`}>
        Comparte este enlace para que otros se unan:
      </p>
      <input
        type="text"
        readOnly
        value={codigoInvitacion}
        className="w-full p-2 border-2 border-black rounded-lg text-center text-white bg-black mb-4"
      />
      <button
        onClick={handleCopy}
        className="w-full p-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition duration-200"
      >
        Copiar Enlace
      </button>
      {copied && (
        <div className="mt-4 text-white bg-green-500 p-2 rounded-md text-center">
          Código copiado al portapapeles!
        </div>
      )}
    </div>
  );
}
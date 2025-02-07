"use client";

import { ReactNode } from "react";

interface ConfirmarEliminarModalProps {
  abrirModal: boolean;
  confirmar: () => void;
  cancelar: () => void;
  mensaje: ReactNode;
  elemento: string;
}

export default function ConfirmarEliminarModal({ abrirModal, confirmar, cancelar, mensaje, elemento }: ConfirmarEliminarModalProps) {
  
    if (!abrirModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-slate-800 p-6 rounded-md w-96 shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Confirmar eliminar {elemento}</h2>
        <p className="text-white">{mensaje}</p>
        <div className="flex justify-between mt-4">
          <button onClick={cancelar} className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-400 hover:text-black">
            Cancelar
          </button>
          <button onClick={confirmar} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 hover:text-black">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
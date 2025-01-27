import { Tarea, Prioridad } from "@/app/tipos";
import React, { useState } from "react";

interface NuevaTarea {
  onClose: () => void;
  onSave: (tarea: Tarea) => void;
  equipoId: number;
  usuarioId: string;
}

const NuevaTarea: React.FC<NuevaTarea> = ({ onClose, onSave, equipoId, usuarioId }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState<Prioridad>(    Prioridad.media); 
  const [fechaLimite, setFechaLimite] = useState("");

  const handleSave = () => {
    if (!titulo || !fechaLimite || !prioridad) {
      alert("El título, la fecha límite y la prioridad son obligatorios.");
      return;
    }
    const usuarioIdCreo = parseInt(usuarioId);
    const tarea: Tarea = {
      titulo,
      descripcion,
      equipoId,
      prioridad,
      fechaLimite,
      usuarioIdCreo,
    };
    onSave(tarea);
    onClose();
  };

  const handlePrioridadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPrioridad = e.target.value as Prioridad;  
    setPrioridad(selectedPrioridad);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-black">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Nueva Tarea</h2>
        <label className="block mb-2">
          Título:
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border rounded mt-1 border-gray-950"
            required
          />
        </label>
        <label className="block mb-2">
          Descripción:
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border rounded mt-1 border-gray-950"
          />
        </label>
        <label className="block mb-2">
          Prioridad:
          <select
            value={prioridad}
            onChange={handlePrioridadChange}
            className="w-full p-2 border rounded mt-1 border-gray-950"
            required
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>
        <label className="block mb-2">
          Fecha Límite:
          <input
            type="datetime-local"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
            className="w-full p-2 border rounded mt-1 border-gray-950"
            required
          />
        </label>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mr-2">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default NuevaTarea;
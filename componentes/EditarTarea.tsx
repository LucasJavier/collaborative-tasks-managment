    import { Prioridad, Tarea } from "@/app/tipos";
    import { useState } from "react";

    interface EditarTareaProp {
        onClose: () => void;
        onSave: (tarea: Tarea) => void;
        tarea: Tarea;
    }
    
    const EditarTarea: React.FC<EditarTareaProp> = ({ onClose, onSave, tarea }) => {
        const [titulo, setTitulo] = useState(tarea.titulo);
        const [descripcion, setDescripcion] = useState(tarea.descripcion || "");
        const [prioridad, setPrioridad] = useState<Prioridad>(tarea.prioridad);
        const [fechaLimite, setFechaLimite] = useState(
            new Date(tarea.fechaLimite).toISOString().slice(0,16)) // Eliminar zona horaria y los milisegundos;

    const handleSave = () => {
        if (!titulo || !fechaLimite || !prioridad) {
            alert("El título, la fecha límite y la prioridad son obligatorios.");
            return;
        }

        const fechaLimiteISO = new Date(fechaLimite).toISOString();

        const tareaActualizada: Tarea = {
            ...tarea,
            titulo,
            descripcion,
            prioridad,
            fechaLimite: fechaLimiteISO,
        };
        onSave(tareaActualizada);
        onClose();
    };

    const handlePrioridadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPrioridad(e.target.value as Prioridad);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-black">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">Editar Tarea</h2>
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

    export default EditarTarea;
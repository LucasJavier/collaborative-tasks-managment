import React from "react";

interface BotonAñadirProps {
  onClick: () => void;
}

const BotonAñadir: React.FC<BotonAñadirProps> = ({ onClick }) => {
  return (
    <button
      className="bg-blue-500 text-white rounded-full py-2 px-4 shadow-lg hover:bg-blue-600 transform transition-transform duration-200 flex items-center space-x-2"
      onClick={onClick}
    >
      <span className="text-xl">+</span>
      <span>Añadir nueva tarea</span>
    </button>
  );
};

export default BotonAñadir;
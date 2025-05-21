
import React from "react";

interface FiltrosPagamentoProps {
  filtro: "todos" | "pendentes" | "pagos" | "atrasados";
  setFiltro: (filtro: "todos" | "pendentes" | "pagos" | "atrasados") => void;
}

const FiltrosPagamento: React.FC<FiltrosPagamentoProps> = ({ filtro, setFiltro }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setFiltro("todos")}
        className={`px-3 py-1 text-sm rounded-md ${
          filtro === "todos"
            ? "bg-fitness-primary text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Todos
      </button>
      <button
        onClick={() => setFiltro("pendentes")}
        className={`px-3 py-1 text-sm rounded-md ${
          filtro === "pendentes"
            ? "bg-yellow-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Pendentes
      </button>
      <button
        onClick={() => setFiltro("pagos")}
        className={`px-3 py-1 text-sm rounded-md ${
          filtro === "pagos"
            ? "bg-green-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Pagos
      </button>
      <button
        onClick={() => setFiltro("atrasados")}
        className={`px-3 py-1 text-sm rounded-md ${
          filtro === "atrasados"
            ? "bg-red-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Atrasados
      </button>
    </div>
  );
};

export default FiltrosPagamento;

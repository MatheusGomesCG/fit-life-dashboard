
import React from "react";
import { Button } from "@/components/ui/button";
import EnviarComprovante from "./EnviarComprovante";

interface ModalComprovanteProps {
  pagamentoId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ModalComprovante: React.FC<ModalComprovanteProps> = ({ pagamentoId, onClose, onSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Enviar Comprovante de Pagamento</h3>
        <EnviarComprovante 
          pagamentoId={pagamentoId}
          onSuccess={onSuccess}
        />
        <Button 
          variant="outline" 
          onClick={onClose}
          className="mt-4 w-full"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default ModalComprovante;

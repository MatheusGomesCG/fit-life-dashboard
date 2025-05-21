
import React from "react";
import { ArrowDown, ArrowUp, Calendar } from "lucide-react";

const InformacoesPagamento: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Informações de Pagamento</h2>
      
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-md">
          <h3 className="text-base font-medium mb-3">Formas de Pagamento</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <div className="bg-green-100 p-1.5 rounded-full mr-2">
                <ArrowDown className="h-4 w-4 text-green-600" />
              </div>
              <span>PIX: (11) 99999-9999</span>
            </li>
            <li className="flex items-center">
              <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <span>Transferência Bancária: Banco FitLife - Ag: 0001 - CC: 12345-6</span>
            </li>
            <li className="flex items-center">
              <div className="bg-purple-100 p-1.5 rounded-full mr-2">
                <ArrowUp className="h-4 w-4 text-purple-600" />
              </div>
              <span>Pagamento no local: Dinheiro ou Cartão</span>
            </li>
          </ul>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-md">
          <h3 className="text-base font-medium mb-2">Observações</h3>
          <p className="text-gray-700 text-sm">
            Após realizar o pagamento, envie o comprovante para seu professor pelo chat ou WhatsApp.
            O pagamento será confirmado em até 24 horas úteis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InformacoesPagamento;


import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { buscarPagamentosPorAluno, Pagamento } from "@/services/pagamentosService";
import LoadingSpinner from "@/components/LoadingSpinner";
import FiltrosPagamento from "@/components/pagamentos/FiltrosPagamento";
import TabelaPagamentos from "@/components/pagamentos/TabelaPagamentos";
import InformacoesPagamento from "@/components/pagamentos/InformacoesPagamento";
import ModalComprovante from "@/components/pagamentos/ModalComprovante";

const MeusPagamentos: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "pendentes" | "pagos" | "atrasados">("todos");
  const [selectedPagamentoId, setSelectedPagamentoId] = useState<string | null>(null);

  const carregarPagamentos = async () => {
    try {
      setLoading(true);
      
      if (user?.id) {
        const pagamentosData = await buscarPagamentosPorAluno(user.id);
        setPagamentos(pagamentosData);
      }
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
      toast.error("Erro ao carregar seus pagamentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPagamentos();
  }, [user]);

  const pagamentosFiltrados = pagamentos.filter((pagamento) => {
    if (filtro === "todos") return true;
    if (filtro === "pendentes") return pagamento.status === "pendente";
    if (filtro === "pagos") return pagamento.status === "pago";
    if (filtro === "atrasados") return pagamento.status === "atrasado";
    return true;
  });

  const handleEnviarComprovanteClick = (pagamentoId: string) => {
    setSelectedPagamentoId(pagamentoId);
  };

  const handleComprovanteSuccess = () => {
    setSelectedPagamentoId(null);
    carregarPagamentos();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meus Pagamentos</h1>
        <p className="text-gray-600 mt-1">
          Visualize o histórico e status das suas mensalidades
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <FiltrosPagamento filtro={filtro} setFiltro={setFiltro} />
        <TabelaPagamentos 
          pagamentos={pagamentosFiltrados} 
          onEnviarComprovante={handleEnviarComprovanteClick} 
        />
      </div>

      <InformacoesPagamento />

      {selectedPagamentoId && (
        <ModalComprovante
          pagamentoId={selectedPagamentoId}
          onClose={() => setSelectedPagamentoId(null)}
          onSuccess={handleComprovanteSuccess}
        />
      )}
    </div>
  );
};

export default MeusPagamentos;

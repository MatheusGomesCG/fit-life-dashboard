
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Pagamento } from "@/services/pagamentosService";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { ChartContainer } from "@/components/ui/chart";

interface PagamentosAnuaisProps {
  pagamentos: Pagamento[];
  isLoading: boolean;
  anoSelecionado: number;
  setAnoSelecionado: (ano: number) => void;
}

// Meses em português
const nomeMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const PagamentosAnuais: React.FC<PagamentosAnuaisProps> = ({ 
  pagamentos, 
  isLoading, 
  anoSelecionado, 
  setAnoSelecionado 
}) => {
  // Gerar dados para o gráfico
  const dadosGrafico = useMemo(() => {
    const dados = nomeMeses.map((mes, index) => {
      const mesNumero = index + 1;
      
      // Filtrar pagamentos do mês e ano correspondente
      const pagamentosMes = pagamentos.filter(p => p.mes === mesNumero && p.ano === anoSelecionado);
      
      // Calcular valores recebidos e pendentes
      const valorRecebido = pagamentosMes
        .filter(p => p.status === "pago")
        .reduce((total, p) => total + p.valor, 0);
      
      const valorPendente = pagamentosMes
        .filter(p => p.status === "pendente" || p.status === "atrasado")
        .reduce((total, p) => total + p.valor, 0);
      
      return {
        nome: mes,
        recebido: valorRecebido,
        pendente: valorPendente,
        total: valorRecebido + valorPendente,
      };
    });
    
    return dados;
  }, [pagamentos, anoSelecionado]);
  
  // Calcular o total anual
  const totalRecebidoAnual = useMemo(() => 
    dadosGrafico.reduce((total, mes) => total + mes.recebido, 0)
  , [dadosGrafico]);
  
  const totalPendenteAnual = useMemo(() => 
    dadosGrafico.reduce((total, mes) => total + mes.pendente, 0)
  , [dadosGrafico]);
  
  // Navegação entre anos
  const anoAnterior = () => setAnoSelecionado(anoSelecionado - 1);
  const proximoAno = () => setAnoSelecionado(anoSelecionado + 1);
  
  // Se os dados estão carregando, mostrar um esqueleto
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-96 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  // Customização do tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-md shadow-md">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-green-600">
            Recebido: R$ {payload[0].value.toFixed(2)}
          </p>
          <p className="text-amber-600">
            Pendente: R$ {payload[1].value.toFixed(2)}
          </p>
          <p className="text-gray-600 font-medium mt-1">
            Total: R$ {(payload[0].value + payload[1].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Resumo Anual de Pagamentos</h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={anoAnterior}
              className="p-1 text-gray-600 hover:text-gray-900"
              aria-label="Ano anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center text-gray-800 font-medium">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>{anoSelecionado}</span>
            </div>
            <button 
              onClick={proximoAno}
              className="p-1 text-gray-600 hover:text-gray-900"
              aria-label="Próximo ano"
              disabled={anoSelecionado >= new Date().getFullYear() + 1}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">Total Recebido</p>
            <p className="text-2xl font-bold text-green-700">
              R$ {totalRecebidoAnual.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-amber-800 font-medium">Total Pendente</p>
            <p className="text-2xl font-bold text-amber-700">
              R$ {totalPendenteAnual.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="h-96">
          <ChartContainer 
            config={{
              recebido: {
                theme: {
                  light: "#22c55e",
                  dark: "#22c55e"
                },
                label: "Recebido"
              },
              pendente: {
                theme: {
                  light: "#f59e0b",
                  dark: "#f59e0b"
                },
                label: "Pendente"
              }
            }}
          >
            <BarChart 
              data={dadosGrafico}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="nome" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="recebido" name="Recebido" fill="var(--color-recebido)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendente" name="Pendente" fill="var(--color-pendente)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Detalhamento Mensal de {anoSelecionado}</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="py-3 px-4 font-medium text-gray-600">Mês</th>
                <th className="py-3 px-4 font-medium text-gray-600">Recebido</th>
                <th className="py-3 px-4 font-medium text-gray-600">Pendente</th>
                <th className="py-3 px-4 font-medium text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dadosGrafico.map((mes, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{mes.nome}</td>
                  <td className="py-3 px-4 text-green-600">R$ {mes.recebido.toFixed(2)}</td>
                  <td className="py-3 px-4 text-amber-600">R$ {mes.pendente.toFixed(2)}</td>
                  <td className="py-3 px-4 font-medium">R$ {mes.total.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4 text-green-700">R$ {totalRecebidoAnual.toFixed(2)}</td>
                <td className="py-3 px-4 text-amber-700">R$ {totalPendenteAnual.toFixed(2)}</td>
                <td className="py-3 px-4">R$ {(totalRecebidoAnual + totalPendenteAnual).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PagamentosAnuais;

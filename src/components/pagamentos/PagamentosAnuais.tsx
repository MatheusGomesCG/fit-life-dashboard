
import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buscarPagamentosPorAno } from "@/services/dashboardService";
import { Pagamento } from "@/services/pagamentosService";

interface PagamentosAnuaisProps {
  pagamentos: Pagamento[];
  isLoading: boolean;
  anoSelecionado: number;
  setAnoSelecionado: (ano: number) => void;
}

interface DadosMes {
  month: string;
  recebido: number;
  pendente: number;
}

const PagamentosAnuais: React.FC<PagamentosAnuaisProps> = ({ 
  anoSelecionado, 
  setAnoSelecionado 
}) => {
  const [dadosPagamentos, setDadosPagamentos] = useState<DadosMes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true);
        const pagamentos = await buscarPagamentosPorAno(anoSelecionado);
        
        // Processar dados por mês
        const meses = [
          'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
          'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
        ];
        
        const dadosProcessados: DadosMes[] = meses.map((month, index) => {
          const mesAtual = index + 1;
          const pagamentosMes = pagamentos.filter(p => p.mes === mesAtual);
          
          const recebido = pagamentosMes
            .filter(p => p.status === 'pago')
            .reduce((total, p) => total + p.valor, 0);
            
          const pendente = pagamentosMes
            .filter(p => p.status === 'pendente' || p.status === 'atrasado')
            .reduce((total, p) => total + p.valor, 0);
          
          return {
            month,
            recebido,
            pendente
          };
        });
        
        setDadosPagamentos(dadosProcessados);
      } catch (error) {
        console.error("Erro ao carregar dados de pagamentos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [anoSelecionado]);

  const totalRecebido = dadosPagamentos.reduce((total, mes) => total + mes.recebido, 0);
  const totalPendente = dadosPagamentos.reduce((total, mes) => total + mes.pendente, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos Anuais ({anoSelecionado})</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Pagamentos Anuais ({anoSelecionado})</span>
          <div className="flex gap-2">
            <button
              onClick={() => setAnoSelecionado(anoSelecionado - 1)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              {anoSelecionado - 1}
            </button>
            <button
              onClick={() => setAnoSelecionado(anoSelecionado + 1)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              {anoSelecionado + 1}
            </button>
          </div>
        </CardTitle>
        <CardDescription>
          Total recebido: R$ {totalRecebido.toFixed(2)} | 
          Total pendente: R$ {totalPendente.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dadosPagamentos}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Recebido
                            </span>
                            <span className="font-bold text-green-600">
                              R$ {payload[0]?.value?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Pendente
                            </span>
                            <span className="font-bold text-orange-600">
                              R$ {payload[1]?.value?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                dataKey="recebido"
                type="monotone"
                fill="currentColor"
                className="fill-green-200 stroke-green-500"
                strokeWidth={2}
              />
              <Area
                dataKey="pendente"
                type="monotone"
                fill="currentColor"
                className="fill-orange-200 stroke-orange-500"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PagamentosAnuais;


import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { buscarDadosAlunosMensais, AlunoMensal } from "@/services/dashboardService";

interface AlunosMensaisProps {
  anoSelecionado: number;
}

const AlunosMensais: React.FC<AlunosMensaisProps> = ({ anoSelecionado }) => {
  const { user } = useAuth();
  const [dadosAlunos, setDadosAlunos] = useState<AlunoMensal[]>([]);
  const [totalAtual, setTotalAtual] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const dados = await buscarDadosAlunosMensais(user.id, anoSelecionado);
        setDadosAlunos(dados.alunosMensais);
        setTotalAtual(dados.totalAtual);
      } catch (error) {
        console.error("Erro ao carregar dados de alunos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [user?.id, anoSelecionado]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alunos por Mês ({anoSelecionado})</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alunos por Mês ({anoSelecionado})</CardTitle>
        <CardDescription>
          Evolução do número de alunos ativos - Total atual: {totalAtual}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosAlunos}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Alunos
                            </span>
                            <span className="font-bold">
                              {payload[0].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar
                dataKey="alunos"
                fill="currentColor"
                className="fill-primary"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlunosMensais;

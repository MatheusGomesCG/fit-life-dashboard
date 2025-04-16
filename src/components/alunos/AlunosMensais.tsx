
import React from 'react';
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

interface AlunosMensaisProps {
  alunosAtivos: number;
  anoSelecionado: number;
}

const AlunosMensais: React.FC<AlunosMensaisProps> = ({ alunosAtivos, anoSelecionado }) => {
  // Mock data for demonstration - in a real app, this would come from your backend
  const data = [
    { month: 'Jan', alunos: Math.floor(alunosAtivos * 0.8) },
    { month: 'Fev', alunos: Math.floor(alunosAtivos * 0.85) },
    { month: 'Mar', alunos: Math.floor(alunosAtivos * 0.9) },
    { month: 'Abr', alunos: alunosAtivos },
    { month: 'Mai', alunos: 0 },
    { month: 'Jun', alunos: 0 },
    { month: 'Jul', alunos: 0 },
    { month: 'Ago', alunos: 0 },
    { month: 'Set', alunos: 0 },
    { month: 'Out', alunos: 0 },
    { month: 'Nov', alunos: 0 },
    { month: 'Dez', alunos: 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alunos por Mês ({anoSelecionado})</CardTitle>
        <CardDescription>Visualização do número de alunos ativos por mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="month" />
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


import React from 'react';
import { CalendarDays, Clock4, User } from 'lucide-react';

const FichaTreino: React.FC = () => {
  // Mock data for demonstration
  const aluno = {
    nome: "João Silva",
    idade: 28,
    objetivo: "Hipertrofia",
  };

  const treino = {
    aquecimento: "5 minutos de esteira",
    exercicios: [
      { nome: "Supino Reto", series: 3, repeticoes: "8-12" },
      { nome: "Agachamento Livre", series: 3, repeticoes: "8-12" },
      { nome: "Remada Curvada", series: 3, repeticoes: "8-12" },
    ],
    descansoEntreSeries: "60 segundos",
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Ficha de Treino</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600">
            <User className="h-5 w-5" />
            <span>{aluno.nome}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <CalendarDays className="h-5 w-5" />
            <span>{aluno.idade} anos</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock4 className="h-5 w-5" />
            <span>Objetivo: {aluno.objetivo}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Informações do Treino</h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Aquecimento</h3>
            <p>{treino.aquecimento}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Exercícios</h3>
            <ul>
              {treino.exercicios.map((exercicio, index) => (
                <li key={index} className="mb-2">
                  <strong>{exercicio.nome}:</strong> {exercicio.series} séries de {exercicio.repeticoes} repetições
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium">Descanso entre as séries</h3>
            <p>{treino.descansoEntreSeries}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichaTreino;

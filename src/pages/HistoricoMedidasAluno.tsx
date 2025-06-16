
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, User, Calendar, Phone, Mail, Target, Activity, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/LoadingSpinner";
import HistoricoMedidas from "@/components/HistoricoMedidas";
import { buscarAlunoPorId, Aluno } from "@/services/alunosService";
import { useAuth } from "@/contexts/AuthContext";

const HistoricoMedidasAluno: React.FC = () => {
  const { alunoId } = useParams<{ alunoId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.tipo !== "professor") {
      navigate("/");
      return;
    }

    if (alunoId) {
      carregarDadosAluno();
    }
  }, [alunoId, isAuthenticated, user?.tipo, navigate]);

  const carregarDadosAluno = async () => {
    if (!alunoId) return;

    try {
      setLoading(true);
      const dadosAluno = await buscarAlunoPorId(alunoId);
      
      if (!dadosAluno) {
        toast.error("Aluno não encontrado");
        navigate("/gerenciar-alunos");
        return;
      }

      setAluno(dadosAluno);
    } catch (error) {
      console.error("Erro ao carregar dados do aluno:", error);
      toast.error("Erro ao carregar dados do aluno");
      navigate("/gerenciar-alunos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aluno não encontrado</p>
      </div>
    );
  }

  const calcularIdade = (dataNascimento: Date | null): number | null => {
    if (!dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  };

  const formatarData = (data: Date | null): string => {
    if (!data) return "Não informado";
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const idadeCalculada = aluno.dataNascimento ? calcularIdade(aluno.dataNascimento) : aluno.idade;

  return (
    <div className="space-y-6">
      {/* Header com botão de voltar */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/gerenciar-alunos")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Histórico de Medidas - {aluno.nome}
          </h1>
          <p className="text-gray-600">
            Acompanhe a evolução das medidas corporais do aluno
          </p>
        </div>
      </div>

      {/* Informações do Aluno */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Aluno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dados Pessoais */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4" />
                Dados Pessoais
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Nome:</span>
                  <p className="text-gray-900">{aluno.nome}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email:
                  </span>
                  <p className="text-gray-900">{aluno.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Telefone:
                  </span>
                  <p className="text-gray-900">{aluno.telefone || "Não informado"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Idade:
                  </span>
                  <p className="text-gray-900">
                    {idadeCalculada ? `${idadeCalculada} anos` : "Não informado"}
                  </p>
                </div>
                {aluno.genero && (
                  <div>
                    <span className="font-medium text-gray-600">Gênero:</span>
                    <p className="text-gray-900 capitalize">{aluno.genero}</p>
                  </div>
                )}
                {aluno.dataNascimento && (
                  <div>
                    <span className="font-medium text-gray-600">Data de Nascimento:</span>
                    <p className="text-gray-900">{formatarData(aluno.dataNascimento)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dados Físicos Atuais */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Medidas Atuais
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Peso:</span>
                  <p className="text-gray-900">{aluno.peso ? `${aluno.peso} kg` : "Não informado"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Altura:</span>
                  <p className="text-gray-900">{aluno.altura ? `${aluno.altura} cm` : "Não informado"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">IMC:</span>
                  <p className="text-gray-900">{aluno.imc ? aluno.imc.toFixed(2) : "Não calculado"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">% Gordura:</span>
                  <p className="text-gray-900">{aluno.percentualGordura ? `${aluno.percentualGordura.toFixed(2)}%` : "Não calculado"}</p>
                </div>
              </div>
            </div>

            {/* Objetivos e Experiência */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Treino e Objetivos
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Objetivo:</span>
                  <p className="text-gray-900">{aluno.objetivo || "Não informado"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Experiência:</span>
                  <p className="text-gray-900">{aluno.experiencia || "Não informado"}</p>
                </div>
                {aluno.valorMensalidade && (
                  <div>
                    <span className="font-medium text-gray-600">Mensalidade:</span>
                    <p className="text-gray-900">
                      R$ {aluno.valorMensalidade.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                )}
                {aluno.dataVencimento && (
                  <div>
                    <span className="font-medium text-gray-600">Vencimento:</span>
                    <p className="text-gray-900">{formatarData(aluno.dataVencimento)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Restrições Médicas e Observações */}
          {(aluno.restricoes_medicas || aluno.observacoes || aluno.endereco) && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                {aluno.restricoes_medicas && (
                  <div>
                    <span className="font-medium text-gray-600 flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      Restrições Médicas:
                    </span>
                    <p className="text-gray-900 bg-orange-50 p-3 rounded-md border border-orange-200">
                      {aluno.restricoes_medicas}
                    </p>
                  </div>
                )}
                
                {aluno.endereco && (
                  <div>
                    <span className="font-medium text-gray-600 mb-2 block">Endereço:</span>
                    <p className="text-gray-900">{aluno.endereco}</p>
                  </div>
                )}

                {aluno.observacoes && (
                  <div>
                    <span className="font-medium text-gray-600 mb-2 block">Observações:</span>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md border">
                      {aluno.observacoes}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Medidas */}
      <Card>
        <CardContent className="p-6">
          <HistoricoMedidas 
            alunoId={alunoId} 
            genero={aluno.genero}
            idade={idadeCalculada || undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricoMedidasAluno;

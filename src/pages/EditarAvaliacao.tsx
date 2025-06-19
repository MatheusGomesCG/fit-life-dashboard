
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/date-picker";
import { ArrowLeft, Save, User } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { buscarAvaliacaoPorId, atualizarAvaliacao, podeEditarAvaliacao, AvaliacaoDetalhada } from "@/services/avaliacaoService";

interface EstrategiaData {
  estrategia: string;
  valor?: number;
  valor_texto?: string;
  unidade?: string;
}

interface GrupoEstrategias {
  [key: string]: {
    ativas: boolean;
    dados: { [estrategia: string]: EstrategiaData };
  };
}

const EditarAvaliacao: React.FC = () => {
  const navigate = useNavigate();
  const { avaliacaoId, alunoId } = useParams<{ avaliacaoId: string; alunoId: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avaliacao, setAvaliacao] = useState<AvaliacaoDetalhada | null>(null);
  const [dataAvaliacao, setDataAvaliacao] = useState<Date>(new Date());
  const [observacoes, setObservacoes] = useState("");
  const [grupos, setGrupos] = useState<GrupoEstrategias>({});

  const estrategiasPorGrupo = {
    "Medidas Corporais": [
      { nome: "Peso", unidade: "kg" },
      { nome: "Altura", unidade: "cm" },
      { nome: "Perímetro do Pescoço", unidade: "cm" },
      { nome: "Perímetro do Tórax", unidade: "cm" },
      { nome: "Perímetro da Cintura", unidade: "cm" },
      { nome: "Perímetro do Quadril", unidade: "cm" },
      // ... outros campos
    ],
    "Dobras Cutâneas": [
      { nome: "Dobra Tricipital", unidade: "mm" },
      { nome: "Dobra Bicipital", unidade: "mm" },
      { nome: "Dobra Subescapular", unidade: "mm" },
      // ... outros campos
    ],
    "Avaliação Postural": [
      { nome: "Cabeça", unidade: "texto" },
      { nome: "Ombros", unidade: "texto" },
      // ... outros campos
    ]
  };

  useEffect(() => {
    if (avaliacaoId && user?.id) {
      carregarAvaliacao();
    }
  }, [avaliacaoId, user?.id]);

  const carregarAvaliacao = async () => {
    try {
      if (!avaliacaoId || !user?.id) return;

      const podeEditar = await podeEditarAvaliacao(avaliacaoId, user.id);
      if (!podeEditar) {
        toast.error("Você não tem permissão para editar esta avaliação");
        navigate("/gerenciar-alunos");
        return;
      }

      const avaliacaoData = await buscarAvaliacaoPorId(avaliacaoId);
      if (!avaliacaoData) {
        toast.error("Avaliação não encontrada");
        navigate("/gerenciar-alunos");
        return;
      }

      setAvaliacao(avaliacaoData);
      setDataAvaliacao(new Date(avaliacaoData.data_avaliacao));
      setObservacoes(avaliacaoData.observacoes);

      // Inicializar grupos com dados da avaliação
      const gruposIniciais: GrupoEstrategias = {};
      
      Object.keys(estrategiasPorGrupo).forEach(grupo => {
        gruposIniciais[grupo] = {
          ativas: false,
          dados: {}
        };
        
        estrategiasPorGrupo[grupo].forEach(estrategia => {
          const dadoExistente = avaliacaoData.dados.find(
            d => d.grupo_estrategia === grupo && d.estrategia === estrategia.nome
          );
          
          gruposIniciais[grupo].dados[estrategia.nome] = {
            estrategia: estrategia.nome,
            unidade: estrategia.unidade,
            valor: dadoExistente?.valor,
            valor_texto: dadoExistente?.valor_texto
          };
          
          if (dadoExistente) {
            gruposIniciais[grupo].ativas = true;
          }
        });
      });
      
      setGrupos(gruposIniciais);
    } catch (error) {
      console.error("Erro ao carregar avaliação:", error);
      toast.error("Erro ao carregar dados da avaliação");
      navigate("/gerenciar-alunos");
    } finally {
      setLoading(false);
    }
  };

  const toggleGrupo = (nomeGrupo: string) => {
    setGrupos(prev => ({
      ...prev,
      [nomeGrupo]: {
        ...prev[nomeGrupo],
        ativas: !prev[nomeGrupo].ativas
      }
    }));
  };

  const updateEstrategiaValor = (grupo: string, estrategia: string, valor: string) => {
    setGrupos(prev => ({
      ...prev,
      [grupo]: {
        ...prev[grupo],
        dados: {
          ...prev[grupo].dados,
          [estrategia]: {
            ...prev[grupo].dados[estrategia],
            valor: valor === "" ? undefined : parseFloat(valor),
            valor_texto: prev[grupo].dados[estrategia].unidade === "texto" ? valor : undefined
          }
        }
      }
    }));
  };

  const salvarAvaliacao = async () => {
    if (!avaliacaoId) return;

    setSaving(true);
    try {
      const dadosParaInserir = [];
      
      Object.entries(grupos).forEach(([nomeGrupo, grupo]) => {
        if (grupo.ativas) {
          Object.entries(grupo.dados).forEach(([nomeEstrategia, dados]) => {
            if (dados.unidade === "texto" && dados.valor_texto) {
              dadosParaInserir.push({
                grupo_estrategia: nomeGrupo,
                estrategia: nomeEstrategia,
                valor_texto: dados.valor_texto,
                unidade: dados.unidade
              });
            } else if (dados.unidade !== "texto" && dados.valor !== undefined) {
              dadosParaInserir.push({
                grupo_estrategia: nomeGrupo,
                estrategia: nomeEstrategia,
                valor: dados.valor,
                unidade: dados.unidade
              });
            }
          });
        }
      });

      await atualizarAvaliacao(
        avaliacaoId,
        dataAvaliacao.toISOString().split('T')[0],
        observacoes,
        dadosParaInserir
      );

      toast.success("Avaliação atualizada com sucesso!");
      navigate(`/historico-medidas/${alunoId}`);
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      toast.error("Erro ao salvar avaliação");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!avaliacao) return <div>Avaliação não encontrada</div>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/historico-medidas/${alunoId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Editar Avaliação Física</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações da Avaliação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="data">Data da Avaliação</Label>
            <DatePicker
              selected={dataAvaliacao}
              onSelect={(date) => date && setDataAvaliacao(date)}
            />
          </div>
          <div>
            <Label htmlFor="observacoes">Observações Gerais</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações sobre a avaliação..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {Object.entries(estrategiasPorGrupo).map(([nomeGrupo, estrategias]) => (
          <Card key={nomeGrupo}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={nomeGrupo}
                  checked={grupos[nomeGrupo]?.ativas || false}
                  onCheckedChange={() => toggleGrupo(nomeGrupo)}
                />
                <Label htmlFor={nomeGrupo} className="text-lg font-semibold cursor-pointer">
                  {nomeGrupo}
                </Label>
              </div>
            </CardHeader>
            
            {grupos[nomeGrupo]?.ativas && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {estrategias.map((estrategia) => (
                    <div key={estrategia.nome}>
                      <Label className="text-sm font-medium">
                        {estrategia.nome} {estrategia.unidade !== "texto" && `(${estrategia.unidade})`}
                      </Label>
                      <Input
                        type={estrategia.unidade === "texto" ? "text" : "number"}
                        step={estrategia.unidade === "texto" ? undefined : "0.1"}
                        value={
                          estrategia.unidade === "texto"
                            ? grupos[nomeGrupo]?.dados[estrategia.nome]?.valor_texto || ""
                            : grupos[nomeGrupo]?.dados[estrategia.nome]?.valor || ""
                        }
                        onChange={(e) => updateEstrategiaValor(nomeGrupo, estrategia.nome, e.target.value)}
                        placeholder={estrategia.unidade === "texto" ? "Descreva..." : "0"}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={salvarAvaliacao}
          disabled={saving}
          className="min-w-[120px]"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
};

export default EditarAvaliacao;


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/date-picker";
import { ArrowLeft, Save, User, Calculator } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Aluno {
  user_id: string;
  nome: string;
  email: string;
  genero: string;
  idade: number;
}

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

interface ComposicaoCorporal {
  imc?: number;
  percentualGordura?: number;
  massaMagra?: number;
  massaGorda?: number;
}

const CadastrarMedidas: React.FC = () => {
  const navigate = useNavigate();
  const { alunoId } = useParams<{ alunoId: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [dataAvaliacao, setDataAvaliacao] = useState<Date>(new Date());
  const [observacoes, setObservacoes] = useState("");
  const [grupos, setGrupos] = useState<GrupoEstrategias>({});
  const [composicaoCorporal, setComposicaoCorporal] = useState<ComposicaoCorporal>({});

  const estrategiasPorGrupo = {
    "Medidas Corporais": [
      { nome: "Peso", unidade: "kg" },
      { nome: "Altura", unidade: "cm" },
      { nome: "Perímetro do Pescoço", unidade: "cm" },
      { nome: "Perímetro do Tórax", unidade: "cm" },
      { nome: "Perímetro da Cintura", unidade: "cm" },
      { nome: "Perímetro do Quadril", unidade: "cm" },
      { nome: "Perímetro do Braço Direito Relaxado", unidade: "cm" },
      { nome: "Perímetro do Braço Esquerdo Relaxado", unidade: "cm" },
      { nome: "Perímetro do Braço Direito Contraído", unidade: "cm" },
      { nome: "Perímetro do Braço Esquerdo Contraído", unidade: "cm" },
      { nome: "Perímetro do Antebraço Direito", unidade: "cm" },
      { nome: "Perímetro do Antebraço Esquerdo", unidade: "cm" },
      { nome: "Perímetro da Coxa Direita", unidade: "cm" },
      { nome: "Perímetro da Coxa Esquerda", unidade: "cm" },
      { nome: "Perímetro da Panturrilha Direita", unidade: "cm" },
      { nome: "Perímetro da Panturrilha Esquerda", unidade: "cm" }
    ],
    "Dobras Cutâneas": [
      { nome: "Dobra Tricipital", unidade: "mm" },
      { nome: "Dobra Bicipital", unidade: "mm" },
      { nome: "Dobra Subescapular", unidade: "mm" },
      { nome: "Dobra Supra-ilíaca", unidade: "mm" },
      { nome: "Dobra Abdominal", unidade: "mm" },
      { nome: "Dobra da Coxa", unidade: "mm" },
      { nome: "Dobra da Panturrilha", unidade: "mm" }
    ],
    "Avaliação Postural": [
      { nome: "Cabeça", unidade: "texto" },
      { nome: "Ombros", unidade: "texto" },
      { nome: "Coluna Cervical", unidade: "texto" },
      { nome: "Coluna Torácica", unidade: "texto" },
      { nome: "Coluna Lombar", unidade: "texto" },
      { nome: "Pelve", unidade: "texto" },
      { nome: "Joelhos", unidade: "texto" },
      { nome: "Pés", unidade: "texto" }
    ],
    "Flexibilidade": [
      { nome: "Teste de Sentar e Alcançar", unidade: "cm" },
      { nome: "Flexão de Ombro", unidade: "graus" },
      { nome: "Extensão de Ombro", unidade: "graus" },
      { nome: "Flexão de Quadril", unidade: "graus" },
      { nome: "Extensão de Quadril", unidade: "graus" }
    ],
    "Testes de Força": [
      { nome: "Força de Preensão Manual", unidade: "kg" },
      { nome: "Teste de Flexão de Braço", unidade: "repetições" },
      { nome: "Teste Abdominal", unidade: "repetições" },
      { nome: "Teste de Agachamento", unidade: "repetições" }
    ],
    "Testes Cardiovasculares": [
      { nome: "Frequência Cardíaca de Repouso", unidade: "bpm" },
      { nome: "Pressão Arterial Sistólica", unidade: "mmHg" },
      { nome: "Pressão Arterial Diastólica", unidade: "mmHg" },
      { nome: "Teste de Caminhada de 6 minutos", unidade: "metros" }
    ]
  };

  useEffect(() => {
    if (alunoId) {
      carregarAluno();
    }
    inicializarGrupos();
  }, [alunoId]);

  const inicializarGrupos = () => {
    const gruposIniciais: GrupoEstrategias = {};
    
    // Inicializar grupos visíveis
    Object.keys(estrategiasPorGrupo).forEach(grupo => {
      gruposIniciais[grupo] = {
        ativas: false,
        dados: {}
      };
      
      estrategiasPorGrupo[grupo].forEach(estrategia => {
        gruposIniciais[grupo].dados[estrategia.nome] = {
          estrategia: estrategia.nome,
          unidade: estrategia.unidade,
          valor: undefined,
          valor_texto: undefined
        };
      });
    });

    // Inicializar grupo de Composição Corporal (oculto, apenas para cálculos)
    gruposIniciais["Composição Corporal"] = {
      ativas: false,
      dados: {
        "IMC": { estrategia: "IMC", unidade: "kg/m²", valor: undefined },
        "Percentual de Gordura": { estrategia: "Percentual de Gordura", unidade: "%", valor: undefined },
        "Massa Magra": { estrategia: "Massa Magra", unidade: "kg", valor: undefined },
        "Massa Gorda": { estrategia: "Massa Gorda", unidade: "kg", valor: undefined }
      }
    };
    
    setGrupos(gruposIniciais);
  };

  const carregarAluno = async () => {
    try {
      const { data, error } = await supabase
        .from("aluno_profiles")
        .select("user_id, nome, email, genero, idade")
        .eq("user_id", alunoId)
        .eq("professor_id", user?.id)
        .single();

      if (error) throw error;
      setAluno(data);
    } catch (error) {
      console.error("Erro ao carregar aluno:", error);
      toast.error("Erro ao carregar dados do aluno");
      navigate("/gerenciar-alunos");
    } finally {
      setLoading(false);
    }
  };

  const calcularComposicaoCorporal = () => {
    const peso = grupos["Medidas Corporais"]?.dados["Peso"]?.valor;
    const altura = grupos["Medidas Corporais"]?.dados["Altura"]?.valor;
    
    if (!peso || !altura || !aluno) return;

    // Calcular IMC
    const alturaMetros = altura / 100;
    const imc = peso / (alturaMetros * alturaMetros);

    // Calcular percentual de gordura usando dobras cutâneas (Jackson & Pollock)
    const dobras = grupos["Dobras Cutâneas"]?.dados;
    let percentualGordura = 0;
    
    if (dobras && Object.values(dobras).some(d => d.valor)) {
      const triceps = dobras["Dobra Tricipital"]?.valor || 0;
      const subescapular = dobras["Dobra Subescapular"]?.valor || 0;
      const suprailiaca = dobras["Dobra Supra-ilíaca"]?.valor || 0;
      
      if (triceps && subescapular && suprailiaca) {
        const somaDobras = triceps + subescapular + suprailiaca;
        
        if (aluno.genero === "masculino") {
          const densidade = 1.10938 - (0.0008267 * somaDobras) + (0.0000016 * Math.pow(somaDobras, 2)) - (0.0002574 * aluno.idade);
          percentualGordura = (495 / densidade) - 450;
        } else {
          const densidade = 1.0994921 - (0.0009929 * somaDobras) + (0.0000023 * Math.pow(somaDobras, 2)) - (0.0001392 * aluno.idade);
          percentualGordura = (495 / densidade) - 450;
        }
      }
    }

    // Calcular massa magra e gorda
    const massaGorda = (peso * percentualGordura) / 100;
    const massaMagra = peso - massaGorda;

    const novaComposicao = {
      imc: Math.round(imc * 100) / 100,
      percentualGordura: Math.round(percentualGordura * 100) / 100,
      massaMagra: Math.round(massaMagra * 100) / 100,
      massaGorda: Math.round(massaGorda * 100) / 100
    };

    setComposicaoCorporal(novaComposicao);

    // Atualizar valores no grupo Composição Corporal (interno)
    setGrupos(prev => ({
      ...prev,
      "Composição Corporal": {
        ...prev["Composição Corporal"],
        ativas: true, // Marcar como ativo para salvar no banco
        dados: {
          ...prev["Composição Corporal"].dados,
          "IMC": { ...prev["Composição Corporal"].dados["IMC"], valor: novaComposicao.imc },
          "Percentual de Gordura": { ...prev["Composição Corporal"].dados["Percentual de Gordura"], valor: novaComposicao.percentualGordura },
          "Massa Magra": { ...prev["Composição Corporal"].dados["Massa Magra"], valor: novaComposicao.massaMagra },
          "Massa Gorda": { ...prev["Composição Corporal"].dados["Massa Gorda"], valor: novaComposicao.massaGorda }
        }
      }
    }));

    toast.success("Composição corporal calculada automaticamente!");
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

    // Auto calcular composição corporal quando peso ou altura mudarem
    if ((estrategia === "Peso" || estrategia === "Altura") && valor) {
      setTimeout(calcularComposicaoCorporal, 100);
    }
  };

  const salvarAvaliacao = async () => {
    if (!user?.id || !alunoId) return;

    setSaving(true);
    try {
      // Criar avaliação
      const { data: avaliacao, error: avaliacaoError } = await supabase
        .from("avaliacoes_fisicas")
        .insert({
          aluno_id: alunoId,
          professor_id: user.id,
          data_avaliacao: dataAvaliacao.toISOString().split('T')[0],
          observacoes
        })
        .select()
        .single();

      if (avaliacaoError) throw avaliacaoError;

      // Inserir dados das estratégias ativas
      const dadosParaInserir = [];
      
      Object.entries(grupos).forEach(([nomeGrupo, grupo]) => {
        if (grupo.ativas) {
          Object.entries(grupo.dados).forEach(([nomeEstrategia, dados]) => {
            if (dados.unidade === "texto" && dados.valor_texto) {
              dadosParaInserir.push({
                avaliacao_id: avaliacao.id,
                grupo_estrategia: nomeGrupo,
                estrategia: nomeEstrategia,
                valor_texto: dados.valor_texto,
                unidade: dados.unidade
              });
            } else if (dados.unidade !== "texto" && dados.valor !== undefined) {
              dadosParaInserir.push({
                avaliacao_id: avaliacao.id,
                grupo_estrategia: nomeGrupo,
                estrategia: nomeEstrategia,
                valor: dados.valor,
                unidade: dados.unidade
              });
            }
          });
        }
      });

      if (dadosParaInserir.length > 0) {
        const { error: dadosError } = await supabase
          .from("dados_avaliacao")
          .insert(dadosParaInserir);

        if (dadosError) throw dadosError;
      }

      toast.success("Avaliação salva com sucesso!");
      navigate(`/historico-medidas/${alunoId}`);
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      toast.error("Erro ao salvar avaliação");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!aluno) return <div>Aluno não encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-6xl">
        {/* Header responsivo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/gerenciar-alunos")}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Nova Avaliação Física</h1>
        </div>

        {/* Card de dados do aluno - Layout responsivo */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Dados do Aluno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-500">Nome</Label>
                <p className="text-gray-900 break-words">{aluno.nome}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="text-gray-600 break-all text-sm">{aluno.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-500">Idade</Label>
                <p className="text-gray-900">{aluno.idade} anos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de informações da avaliação */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Informações da Avaliação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data">Data da Avaliação</Label>
                <DatePicker
                  selected={dataAvaliacao}
                  onSelect={(date) => date && setDataAvaliacao(date)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="observacoes">Observações Gerais</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações sobre a avaliação..."
                rows={3}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Botão para calcular composição corporal */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="pt-6">
            <Button
              onClick={calcularComposicaoCorporal}
              className="w-full"
              variant="outline"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calcular Composição Corporal Automaticamente
            </Button>
          </CardContent>
        </Card>

        {/* Grupos de estratégias - Layout responsivo */}
        <div className="space-y-4 sm:space-y-6">
          {Object.entries(estrategiasPorGrupo).map(([nomeGrupo, estrategias]) => (
            <Card key={nomeGrupo} className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={nomeGrupo}
                    checked={grupos[nomeGrupo]?.ativas || false}
                    onCheckedChange={() => toggleGrupo(nomeGrupo)}
                  />
                  <Label htmlFor={nomeGrupo} className="text-base sm:text-lg font-semibold cursor-pointer">
                    {nomeGrupo}
                  </Label>
                </div>
              </CardHeader>
              
              {grupos[nomeGrupo]?.ativas && (
                <CardContent className="pt-0">
                  {/* Grid responsivo para os campos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {estrategias.map((estrategia) => (
                      <div key={estrategia.nome} className="space-y-2">
                        <Label className="text-sm font-medium break-words">
                          {estrategia.nome} 
                          {estrategia.unidade !== "texto" && (
                            <span className="text-gray-500 ml-1">({estrategia.unidade})</span>
                          )}
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
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Botão de salvar - Fixo na parte inferior em mobile */}
        <div className="mt-8 sticky bottom-4 sm:static sm:bottom-auto">
          <div className="flex justify-center sm:justify-end">
            <Button
              onClick={salvarAvaliacao}
              disabled={saving}
              className="w-full sm:w-auto min-w-[200px] shadow-lg sm:shadow-none"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Avaliação"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastrarMedidas;

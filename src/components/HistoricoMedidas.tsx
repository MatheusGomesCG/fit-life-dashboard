import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  buscarHistoricoMedidas, 
  adicionarMedidaHistorico, 
  calcularIMC, 
  calcularPercentualGordura,
  HistoricoMedida 
} from "@/services/alunosService";
import { Calendar, Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import FormInput from "@/components/FormInput";
import LoadingSpinner from "@/components/LoadingSpinner";

interface HistoricoMedidasProps {
  alunoId?: string;
  genero?: "masculino" | "feminino";
  idade?: number;
}

const HistoricoMedidas: React.FC<HistoricoMedidasProps> = ({ alunoId, genero, idade }) => {
  const [historico, setHistorico] = useState<HistoricoMedida[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [incluirDobras, setIncluirDobras] = useState(false);
  
  const [novaMedida, setNovaMedida] = useState({
    peso: "",
    altura: "",
    dataMedicao: new Date(),
    observacoes: "",
    dobrasCutaneas: {
      triceps: "",
      subescapular: "",
      axilarMedia: "",
      peitoral: "",
      suprailiaca: "",
      abdominal: "",
      coxa: "",
    },
    medidasCorporais: {
      pescoco: "",
      torax: "",
      bracoEsquerdo: "",
      bracoDireito: "",
      antebracoEsquerdo: "",
      antebracoDireito: "",
      cintura: "",
      quadril: "",
      coxaEsquerda: "",
      coxaDireita: "",
      panturrilhaEsquerda: "",
      panturrilhaDireita: "",
    }
  });

  useEffect(() => {
    if (alunoId) {
      carregarHistorico();
    }
  }, [alunoId]);

  const carregarHistorico = async () => {
    if (!alunoId) return;
    
    try {
      setLoading(true);
      const dados = await buscarHistoricoMedidas(alunoId);
      setHistorico(dados);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      toast.error("Erro ao carregar histórico de medidas");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNovaMedida(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleDobraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldName = id.split("-")[1]; // Formato: "dobra-triceps"
    
    setNovaMedida(prev => ({
      ...prev,
      dobrasCutaneas: {
        ...prev.dobrasCutaneas,
        [fieldName]: value
      }
    }));
  };

  const handleMedidaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldName = id.split("-")[1]; // Formato: "medida-pescoco"
    
    setNovaMedida(prev => ({
      ...prev,
      medidasCorporais: {
        ...prev.medidasCorporais,
        [fieldName]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!alunoId || !novaMedida.peso || !novaMedida.altura) {
      toast.error("Peso e altura são obrigatórios");
      return;
    }

    // Se incluir dobras, verificar se todas estão preenchidas
    if (incluirDobras) {
      const dobras = Object.values(novaMedida.dobrasCutaneas);
      if (dobras.some(value => value === "")) {
        toast.error("Por favor, preencha todas as dobras cutâneas ou desmarque a opção");
        return;
      }
    }

    try {
      setSubmitting(true);

      const peso = parseFloat(novaMedida.peso);
      const altura = parseFloat(novaMedida.altura);
      const imc = calcularIMC(peso, altura);
      
      let dobrasCutaneasNumeric = null;
      let percentualGordura = 22; // valor padrão

      if (incluirDobras) {
        dobrasCutaneasNumeric = {
          triceps: parseFloat(novaMedida.dobrasCutaneas.triceps),
          subescapular: parseFloat(novaMedida.dobrasCutaneas.subescapular),
          axilarMedia: parseFloat(novaMedida.dobrasCutaneas.axilarMedia),
          peitoral: parseFloat(novaMedida.dobrasCutaneas.peitoral),
          suprailiaca: parseFloat(novaMedida.dobrasCutaneas.suprailiaca),
          abdominal: parseFloat(novaMedida.dobrasCutaneas.abdominal),
          coxa: parseFloat(novaMedida.dobrasCutaneas.coxa),
        };

        percentualGordura = genero && idade ? 
          calcularPercentualGordura(dobrasCutaneasNumeric, genero, idade) : 22;
      }

      // Processar medidas corporais (apenas as preenchidas)
      const medidasCorporaisNumeric: any = {};
      Object.entries(novaMedida.medidasCorporais).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          medidasCorporaisNumeric[key] = parseFloat(value);
        }
      });

      await adicionarMedidaHistorico({
        aluno_id: alunoId,
        peso,
        altura,
        imc,
        percentual_gordura: percentualGordura,
        dobras_cutaneas: dobrasCutaneasNumeric,
        medidas_corporais: Object.keys(medidasCorporaisNumeric).length > 0 ? medidasCorporaisNumeric : null,
        observacoes: novaMedida.observacoes,
        data_medicao: novaMedida.dataMedicao.toISOString().split('T')[0]
      });

      toast.success("Medida adicionada ao histórico com sucesso!");
      await carregarHistorico();
      setShowForm(false);
      
      // Resetar formulário
      setNovaMedida({
        peso: "",
        altura: "",
        dataMedicao: new Date(),
        observacoes: "",
        dobrasCutaneas: {
          triceps: "",
          subescapular: "",
          axilarMedia: "",
          peitoral: "",
          suprailiaca: "",
          abdominal: "",
          coxa: "",
        },
        medidasCorporais: {
          pescoco: "",
          torax: "",
          bracoEsquerdo: "",
          bracoDireito: "",
          antebracoEsquerdo: "",
          antebracoDireito: "",
          cintura: "",
          quadril: "",
          coxaEsquerda: "",
          coxaDireita: "",
          panturrilhaEsquerda: "",
          panturrilhaDireita: "",
        }
      });
      setIncluirDobras(false);
    } catch (error) {
      console.error("Erro ao adicionar medida:", error);
      toast.error("Erro ao adicionar medida ao histórico");
    } finally {
      setSubmitting(false);
    }
  };

  const getTendencia = (valorAtual: number, valorAnterior: number): React.ReactNode => {
    if (valorAtual > valorAnterior) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (valorAtual < valorAnterior) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  if (!alunoId) {
    return (
      <div className="text-gray-500 text-center py-8">
        Selecione um aluno para visualizar o histórico de medidas
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Histórico de Medidas Corporais</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Medida</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h4 className="text-md font-medium mb-4">Adicionar Nova Medida</h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                id="peso"
                label="Peso (kg)"
                type="number"
                value={novaMedida.peso}
                onChange={handleInputChange}
                min={1}
                max={300}
                step={0.1}
                required
              />
              
              <FormInput
                id="altura"
                label="Altura (cm)"
                type="number"
                value={novaMedida.altura}
                onChange={handleInputChange}
                min={1}
                max={250}
                required
              />
              
              <div>
                <label className="fitness-label block mb-2">Data da Medição</label>
                <DatePicker
                  selected={novaMedida.dataMedicao}
                  onSelect={(date) => setNovaMedida(prev => ({ ...prev, dataMedicao: date || new Date() }))}
                  placeholder="Selecione a data"
                />
              </div>
            </div>

            {/* Medidas Corporais */}
            <div>
              <h5 className="text-sm font-medium mb-3">Medidas Corporais (cm)</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormInput
                  id="medida-pescoco"
                  label="Pescoço"
                  type="number"
                  value={novaMedida.medidasCorporais.pescoco}
                  onChange={handleMedidaChange}
                  min={0}
                  step={0.1}
                />
                
                <FormInput
                  id="medida-torax"
                  label="Tórax"
                  type="number"
                  value={novaMedida.medidasCorporais.torax}
                  onChange={handleMedidaChange}
                  min={0}
                  step={0.1}
                />
                
                <FormInput
                  id="medida-bracoEsquerdo"
                  label="Braço Esquerdo"
                  type="number"
                  value={novaMedida.medidasCorporais.bracoEsquerdo}
                  onChange={handleMedidaChange}
                  min={0}
                  step={0.1}
                />
                
                <FormInput
                  id="medida-bracoDireito"
                  label="Braço Direito"
                  type="number"
                  value={novaMedida.medidasCorporais.bracoDireito}
                  onChange={handleMedidaChange}
                  min={0}
                  step={0.1}
                />
                
                <FormInput
                  id="medida-antebracoEsquerdo"
                  label="Antebraço Esquerdo"
                  type="number"
                  value={novaMedida.medidasCorporais.antebracoEsquerdo}
                  onChange={handleMedidaChange}
                  min={0}
                  step={0.1}
                />
                
                <FormInput
                  id="medida-antebracoDireito"
                  label="Antebraço Direito"
                  type="number"
                  value={novaMedida.medidasCorporais.antebracoDireito}
                  onChange={handleMedidaChange}
                  min={0}
                  step={0.1}
                />
                
                <FormInput
                  id="medida-cintura"
                  label="Cintura"
                  type="number"
                  value={novaMedida.medidasCorporais.cintura}
                  onChange={handleMedidaChange}
                  min={0}
                  step={0.1}
                />
                
                <FormInput
                  id="medida-quadril"
                  label="Quadril"
                  type="number"
                  value={novaMedida.medidasCorporais.quadril}
                  onChange={handleMedidaChange}
                  min={0}
                  step={0.1}
                />
                
                <FormInput
                  id="medida-coxaEsquerda"
                  label="Coxa Esquerda"
                  type="number"
                  value={novaMedida.medidasCorporais.coxaEsquerda}
                  onChange={handleMedidaChange}
                  min={0}
                  step={0.1}
                />
                
                <FormInput
                  id="medida-coxaDireita"
                  label="Coxa Direita"
                  type="number"
                  value={novaMedida.medidasCorporais.coxaDireita}
                  onChange={handleMedidaChange}
                  min={0}
                  step={0.1}
                />
                
                <FormInput
                  id="medida-panturrilhaEsquerda"
                  label="Panturrilha Esquerda"
                  type="number"
                  value={novaMedida.medidasCorporais.panturrilhaEsquerda}
                  onChange={handleMedidaChange}
                  min={0}
                  step={0.1}
                />
                
                <FormInput
                  id="medida-panturrilhaDireita"
                  label="Panturrilha Direita"
                  type="number"
                  value={novaMedida.medidasCorporais.panturrilhaDireita}
                  onChange={handleMedidaChange}
                  min={0}
                  step={0.1}
                />
              </div>
            </div>

            {/* Opção para incluir dobras cutâneas */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="incluirDobras"
                checked={incluirDobras}
                onChange={(e) => setIncluirDobras(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="incluirDobras" className="text-sm font-medium text-gray-700">
                Incluir medição de dobras cutâneas
              </label>
            </div>

            {incluirDobras && (
              <div>
                <h5 className="text-sm font-medium mb-3">Dobras Cutâneas (mm)</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormInput
                    id="dobra-triceps"
                    label="Tríceps"
                    type="number"
                    value={novaMedida.dobrasCutaneas.triceps}
                    onChange={handleDobraChange}
                    min={0}
                    step={0.1}
                    required={incluirDobras}
                  />
                  
                  <FormInput
                    id="dobra-subescapular"
                    label="Subescapular"
                    type="number"
                    value={novaMedida.dobrasCutaneas.subescapular}
                    onChange={handleDobraChange}
                    min={0}
                    step={0.1}
                    required={incluirDobras}
                  />
                  
                  <FormInput
                    id="dobra-axilarMedia"
                    label="Axilar Média"
                    type="number"
                    value={novaMedida.dobrasCutaneas.axilarMedia}
                    onChange={handleDobraChange}
                    min={0}
                    step={0.1}
                    required={incluirDobras}
                  />
                  
                  <FormInput
                    id="dobra-peitoral"
                    label="Peitoral"
                    type="number"
                    value={novaMedida.dobrasCutaneas.peitoral}
                    onChange={handleDobraChange}
                    min={0}
                    step={0.1}
                    required={incluirDobras}
                  />
                  
                  <FormInput
                    id="dobra-suprailiaca"
                    label="Suprailíaca"
                    type="number"
                    value={novaMedida.dobrasCutaneas.suprailiaca}
                    onChange={handleDobraChange}
                    min={0}
                    step={0.1}
                    required={incluirDobras}
                  />
                  
                  <FormInput
                    id="dobra-abdominal"
                    label="Abdominal"
                    type="number"
                    value={novaMedida.dobrasCutaneas.abdominal}
                    onChange={handleDobraChange}
                    min={0}
                    step={0.1}
                    required={incluirDobras}
                  />
                  
                  <FormInput
                    id="dobra-coxa"
                    label="Coxa"
                    type="number"
                    value={novaMedida.dobrasCutaneas.coxa}
                    onChange={handleDobraChange}
                    min={0}
                    step={0.1}
                    required={incluirDobras}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="observacoes" className="fitness-label block mb-2">
                Observações
              </label>
              <textarea
                id="observacoes"
                value={novaMedida.observacoes}
                onChange={handleInputChange}
                className="fitness-input w-full min-h-[100px]"
                placeholder="Observações sobre a medição"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors disabled:opacity-50"
              >
                {submitting ? <LoadingSpinner size="small" /> : "Salvar Medida"}
              </button>
              
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {historico.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhuma medida registrada ainda</p>
          <p className="text-sm">Adicione a primeira medida para começar o acompanhamento</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Data</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Peso (kg)</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Altura (cm)</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">IMC</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">% Gordura</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Medidas</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Observações</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((medida, index) => {
                const medidaAnterior = historico[index + 1];
                
                return (
                  <tr key={medida.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 text-sm">
                      {new Date(medida.data_medicao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span>{medida.peso?.toFixed(1)}</span>
                        {medidaAnterior && medida.peso && medidaAnterior.peso && 
                          getTendencia(medida.peso, medidaAnterior.peso)
                        }
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">
                      {medida.altura?.toFixed(0)}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span>{medida.imc?.toFixed(2)}</span>
                        {medidaAnterior && medida.imc && medidaAnterior.imc && 
                          getTendencia(medida.imc, medidaAnterior.imc)
                        }
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span>{medida.percentual_gordura?.toFixed(2)}%</span>
                        {medidaAnterior && medida.percentual_gordura && medidaAnterior.percentual_gordura && 
                          getTendencia(medida.percentual_gordura, medidaAnterior.percentual_gordura)
                        }
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">
                      {medida.medidas_corporais ? (
                        <div className="text-xs">
                          {Object.entries(medida.medidas_corporais).map(([key, value]) => (
                            <div key={key} className="truncate">
                              {key}: {value}cm
                            </div>
                          )).slice(0, 3)}
                          {Object.keys(medida.medidas_corporais).length > 3 && (
                            <div className="text-gray-500">+{Object.keys(medida.medidas_corporais).length - 3} mais</div>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">
                      {medida.observacoes || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoricoMedidas;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  buscarAlunoPorId,
  atualizarAluno,
  calcularIMC,
  calcularPercentualGordura,
  Aluno,
} from "@/services/alunosService";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { DatePicker } from "@/components/date-picker";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Save, ArrowLeft, Calculator } from "lucide-react";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  idade: string;
  dataNascimento: Date | null;
  genero: "masculino" | "feminino" | "";
  endereco: string;
  objetivo: string;
  observacoes: string;
  valorMensalidade: string;
  dataVencimento: Date | null;
  peso: string;
  altura: string;
  experiencia: "" | "iniciante" | "intermediario" | "avancado";
  dobrasCutaneas: {
    triceps: string;
    subescapular: string;
    axilarMedia: string;
    peitoral: string;
    suprailiaca: string;
    abdominal: string;
    coxa: string;
  };
}

interface FormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  idade?: string;
  peso?: string;
  altura?: string;
  experiencia?: string;
  genero?: string;
  valorMensalidade?: string;
  dataNascimento?: string;
  dataVencimento?: string;
}

const EditarAluno: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    idade: "",
    dataNascimento: null,
    genero: "",
    endereco: "",
    objetivo: "",
    observacoes: "",
    valorMensalidade: "",
    dataVencimento: null,
    peso: "",
    altura: "",
    experiencia: "",
    dobrasCutaneas: {
      triceps: "",
      subescapular: "",
      axilarMedia: "",
      peitoral: "",
      suprailiaca: "",
      abdominal: "",
      coxa: "",
    },
  });
  const [calculatedValues, setCalculatedValues] = useState({
    imc: 0,
    percentualGordura: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchAluno = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const aluno = await buscarAlunoPorId(id);
        
        if (!aluno) return;
        
        // Preencher o formulário com os dados do aluno
        setForm({
          nome: aluno.nome,
          email: aluno.email || "",
          telefone: aluno.telefone || "",
          idade: aluno.idade.toString(),
          dataNascimento: aluno.dataNascimento ? new Date(aluno.dataNascimento) : null,
          genero: (aluno.genero === "outro" ? "" : aluno.genero) as "masculino" | "feminino" | "",
          endereco: aluno.endereco || "",
          objetivo: aluno.objetivo || "",
          observacoes: aluno.observacoes || "",
          valorMensalidade: aluno.valorMensalidade?.toString() || "",
          dataVencimento: aluno.dataVencimento ? new Date(aluno.dataVencimento) : null,
          peso: aluno.peso.toString(),
          altura: aluno.altura.toString(),
          experiencia: (aluno.experiencia || "") as "" | "iniciante" | "intermediario" | "avancado",
          dobrasCutaneas: {
            triceps: aluno.dobrasCutaneas?.triceps?.toString() || "",
            subescapular: aluno.dobrasCutaneas?.subescapular?.toString() || "",
            axilarMedia: aluno.dobrasCutaneas?.axilarMedia?.toString() || "",
            peitoral: aluno.dobrasCutaneas?.peitoral?.toString() || "",
            suprailiaca: aluno.dobrasCutaneas?.suprailiaca?.toString() || "",
            abdominal: aluno.dobrasCutaneas?.abdominal?.toString() || "",
            coxa: aluno.dobrasCutaneas?.coxa?.toString() || "",
          },
        });

        // Definir valores calculados
        setCalculatedValues({
          imc: aluno.imc || 0,
          percentualGordura: aluno.percentualGordura || 0,
        });
        
        setShowPreview(true);
      } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
        toast.error("Erro ao buscar dados do aluno.");
        navigate("/gerenciar-alunos");
      } finally {
        setLoading(false);
      }
    };

    fetchAluno();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDobraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldName = id.split("-")[1]; // Formato: "dobra-triceps"
    
    setForm((prev) => ({
      ...prev,
      dobrasCutaneas: {
        ...prev.dobrasCutaneas,
        [fieldName]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!form.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }
    
    if (!form.idade) {
      newErrors.idade = "Idade é obrigatória";
    } else if (parseInt(form.idade) <= 0 || parseInt(form.idade) > 120) {
      newErrors.idade = "Idade deve estar entre 1 e 120 anos";
    }
    
    if (!form.peso) {
      newErrors.peso = "Peso é obrigatório";
    } else if (parseFloat(form.peso) <= 0 || parseFloat(form.peso) > 300) {
      newErrors.peso = "Peso deve estar entre 1 e 300 kg";
    }
    
    if (!form.altura) {
      newErrors.altura = "Altura é obrigatória";
    } else if (parseInt(form.altura) <= 0 || parseInt(form.altura) > 250) {
      newErrors.altura = "Altura deve estar entre 1 e 250 cm";
    }
    
    if (!form.experiencia) {
      newErrors.experiencia = "Nível de experiência é obrigatório";
    }
    
    if (!form.genero) {
      newErrors.genero = "Gênero é obrigatório";
    }
    
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email inválido";
    }
    
    if (form.valorMensalidade && (isNaN(parseFloat(form.valorMensalidade)) || parseFloat(form.valorMensalidade) < 0)) {
      newErrors.valorMensalidade = "Valor da mensalidade deve ser um número positivo";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateMetrics = () => {
    // Verificar se todas as dobras cutâneas estão preenchidas
    const dobras = Object.values(form.dobrasCutaneas);
    const allDobrasPreenchidas = dobras.every(value => value !== "");
    
    if (!form.peso || !form.altura || (allDobrasPreenchidas === false)) {
      toast.error("Preencha pelo menos peso, altura e todas as dobras para calcular as métricas");
      return;
    }
    
    // Conversão das dobras para números
    const dobrasCutaneasNumeric = {
      triceps: parseFloat(form.dobrasCutaneas.triceps),
      subescapular: parseFloat(form.dobrasCutaneas.subescapular),
      axilarMedia: parseFloat(form.dobrasCutaneas.axilarMedia),
      peitoral: parseFloat(form.dobrasCutaneas.peitoral),
      suprailiaca: parseFloat(form.dobrasCutaneas.suprailiaca),
      abdominal: parseFloat(form.dobrasCutaneas.abdominal),
      coxa: parseFloat(form.dobrasCutaneas.coxa),
    };
    
    const peso = parseFloat(form.peso);
    const altura = parseFloat(form.altura);
    const idade = parseInt(form.idade);
    const genero = form.genero as "masculino" | "feminino";
    
    const imc = calcularIMC(peso, altura);
    const percentualGordura = calcularPercentualGordura(dobrasCutaneasNumeric, genero, idade);
    
    setCalculatedValues({
      imc,
      percentualGordura,
    });
    
    setShowPreview(true);
    toast.success("Métricas calculadas com sucesso!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }
    
    // Verificar se todas as dobras cutâneas estão preenchidas
    const dobras = Object.values(form.dobrasCutaneas);
    if (dobras.some(value => value === "")) {
      toast.error("Por favor, preencha todas as dobras cutâneas");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!form.genero) {
        toast.error("Por favor, selecione um gênero");
        setIsSubmitting(false);
        return;
      }

      // Converter dados do formulário para o formato esperado pela API
      const alunoData: Partial<Aluno> = {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        idade: parseInt(form.idade),
        dataNascimento: form.dataNascimento,
        genero: form.genero,
        endereco: form.endereco,
        objetivo: form.objetivo,
        observacoes: form.observacoes,
        valorMensalidade: form.valorMensalidade ? parseFloat(form.valorMensalidade) : undefined,
        dataVencimento: form.dataVencimento,
        peso: parseFloat(form.peso),
        altura: parseInt(form.altura),
        experiencia: form.experiencia as "iniciante" | "intermediario" | "avancado",
        dobrasCutaneas: {
          triceps: parseFloat(form.dobrasCutaneas.triceps),
          subescapular: parseFloat(form.dobrasCutaneas.subescapular),
          axilarMedia: parseFloat(form.dobrasCutaneas.axilarMedia),
          peitoral: parseFloat(form.dobrasCutaneas.peitoral),
          suprailiaca: parseFloat(form.dobrasCutaneas.suprailiaca),
          abdominal: parseFloat(form.dobrasCutaneas.abdominal),
          coxa: parseFloat(form.dobrasCutaneas.coxa),
        },
        percentualGordura: calculatedValues.percentualGordura,
        imc: calculatedValues.imc
      };
      
      await atualizarAluno(id, alunoData);
      toast.success("Aluno atualizado com sucesso!");
      navigate("/gerenciar-alunos");
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      toast.error("Erro ao atualizar aluno. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const niveisExperiencia = [
    { value: "iniciante", label: "Iniciante" },
    { value: "intermediario", label: "Intermediário" },
    { value: "avancado", label: "Avançado" },
  ];
  
  const opcoesGenero = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Aluno</h1>
          <p className="text-gray-600 mt-1">
            Atualize os dados do aluno
          </p>
        </div>
        <button
          onClick={() => navigate("/gerenciar-alunos")}
          className="flex items-center gap-1 text-gray-600 hover:text-fitness-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para lista</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna 1: Dados Pessoais */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Dados Pessoais</h2>
              
              <FormInput
                id="nome"
                label="Nome Completo"
                value={form.nome}
                onChange={handleChange}
                required
                error={errors.nome}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="idade"
                  label="Idade"
                  type="number"
                  value={form.idade}
                  onChange={handleChange}
                  min={1}
                  max={120}
                  required
                  error={errors.idade}
                />
                
                <FormSelect
                  id="genero"
                  label="Gênero"
                  value={form.genero}
                  onChange={handleSelectChange}
                  options={opcoesGenero}
                  required
                  error={errors.genero}
                />
              </div>
              
              <div>
                <label htmlFor="dataNascimento" className="fitness-label block mb-2">
                  Data de Nascimento
                </label>
                <DatePicker
                  selected={form.dataNascimento}
                  onSelect={(date) => setForm(prev => ({ ...prev, dataNascimento: date }))}
                  placeholder="Selecione a data"
                />
                {errors.dataNascimento && <p className="mt-1 text-xs text-red-500">{errors.dataNascimento}</p>}
              </div>
              
              <FormInput
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
              
              <FormInput
                id="telefone"
                label="Telefone"
                value={form.telefone}
                onChange={handleChange}
              />
              
              <FormInput
                id="endereco"
                label="Endereço"
                value={form.endereco}
                onChange={handleChange}
              />
            </div>
            
            {/* Coluna 2: Dados Financeiros e Objetivo */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Dados Financeiros e Objetivo</h2>
              
              <FormInput
                id="valorMensalidade"
                label="Valor da Mensalidade (R$)"
                type="number"
                value={form.valorMensalidade}
                onChange={handleChange}
                min={0}
                step={0.01}
                error={errors.valorMensalidade}
              />
              
              <div>
                <label htmlFor="dataVencimento" className="fitness-label block mb-2">
                  Data de Vencimento
                </label>
                <DatePicker
                  selected={form.dataVencimento}
                  onSelect={(date) => setForm(prev => ({ ...prev, dataVencimento: date }))}
                  placeholder="Selecione a data"
                />
                {errors.dataVencimento && <p className="mt-1 text-xs text-red-500">{errors.dataVencimento}</p>}
              </div>
              
              <div>
                <label htmlFor="objetivo" className="fitness-label block mb-2">
                  Objetivo
                </label>
                <textarea
                  id="objetivo"
                  value={form.objetivo}
                  onChange={handleChange}
                  className="fitness-input w-full min-h-[100px]"
                  placeholder="Descreva o objetivo do aluno"
                />
              </div>
              
              <div>
                <label htmlFor="observacoes" className="fitness-label block mb-2">
                  Observações
                </label>
                <textarea
                  id="observacoes"
                  value={form.observacoes}
                  onChange={handleChange}
                  className="fitness-input w-full min-h-[100px]"
                  placeholder="Observações adicionais"
                />
              </div>
              
              <FormSelect
                id="experiencia"
                label="Nível de Experiência"
                value={form.experiencia}
                onChange={handleSelectChange}
                options={niveisExperiencia}
                required
                error={errors.experiencia}
              />
            </div>
            
            {/* Coluna 3: Medidas Antropométricas */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Medidas Antropométricas</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="peso"
                  label="Peso (kg)"
                  type="number"
                  value={form.peso}
                  onChange={handleChange}
                  min={1}
                  max={300}
                  step={0.1}
                  required
                  error={errors.peso}
                />
                
                <FormInput
                  id="altura"
                  label="Altura (cm)"
                  type="number"
                  value={form.altura}
                  onChange={handleChange}
                  min={1}
                  max={250}
                  required
                  error={errors.altura}
                />
              </div>
              
              <h3 className="text-md font-medium mt-4 mb-2">Dobras Cutâneas (mm)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="dobra-triceps"
                  label="Tríceps"
                  type="number"
                  value={form.dobrasCutaneas.triceps}
                  onChange={handleDobraChange}
                  min={0}
                  step={0.1}
                  required
                />
                
                <FormInput
                  id="dobra-subescapular"
                  label="Subescapular"
                  type="number"
                  value={form.dobrasCutaneas.subescapular}
                  onChange={handleDobraChange}
                  min={0}
                  step={0.1}
                  required
                />
                
                <FormInput
                  id="dobra-axilarMedia"
                  label="Axilar Média"
                  type="number"
                  value={form.dobrasCutaneas.axilarMedia}
                  onChange={handleDobraChange}
                  min={0}
                  step={0.1}
                  required
                />
                
                <FormInput
                  id="dobra-peitoral"
                  label="Peitoral"
                  type="number"
                  value={form.dobrasCutaneas.peitoral}
                  onChange={handleDobraChange}
                  min={0}
                  step={0.1}
                  required
                />
                
                <FormInput
                  id="dobra-suprailiaca"
                  label="Suprailíaca"
                  type="number"
                  value={form.dobrasCutaneas.suprailiaca}
                  onChange={handleDobraChange}
                  min={0}
                  step={0.1}
                  required
                />
                
                <FormInput
                  id="dobra-abdominal"
                  label="Abdominal"
                  type="number"
                  value={form.dobrasCutaneas.abdominal}
                  onChange={handleDobraChange}
                  min={0}
                  step={0.1}
                  required
                />
                
                <FormInput
                  id="dobra-coxa"
                  label="Coxa"
                  type="number"
                  value={form.dobrasCutaneas.coxa}
                  onChange={handleDobraChange}
                  min={0}
                  step={0.1}
                  required
                />
              </div>
              
              <button
                type="button"
                onClick={calculateMetrics}
                className="mt-4 w-full py-2 bg-fitness-secondary text-white rounded-md hover:bg-fitness-secondary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Calculator className="h-5 w-5" />
                <span>Calcular Métricas</span>
              </button>
            </div>
          </div>
          
          {showPreview && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Métricas Calculadas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-gray-700 mb-2">Índice de Massa Corporal (IMC)</h3>
                  <p className="text-2xl font-bold text-fitness-secondary">
                    {calculatedValues.imc.toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {calculatedValues.imc < 18.5
                      ? "Abaixo do peso"
                      : calculatedValues.imc < 25
                      ? "Peso normal"
                      : calculatedValues.imc < 30
                      ? "Sobrepeso"
                      : "Obesidade"}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-gray-700 mb-2">Percentual de Gordura</h3>
                  <p className="text-2xl font-bold text-fitness-primary">
                    {calculatedValues.percentualGordura.toFixed(2)}%
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Baseado na fórmula de Jackson e Pollock
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarAluno;

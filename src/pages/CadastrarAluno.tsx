
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  cadastrarAluno,
  calcularIMC,
  calcularPercentualGordura,
} from "@/services/alunosService";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Save, ArrowLeft } from "lucide-react";

interface FormData {
  nome: string;
  idade: string;
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
  idade?: string;
  peso?: string;
  altura?: string;
  experiencia?: string;
}

const CadastrarAluno: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    nome: "",
    idade: "",
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
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    const imc = calcularIMC(peso, altura);
    const percentualGordura = calcularPercentualGordura(dobrasCutaneasNumeric, "masculino", idade);
    
    setCalculatedValues({
      imc,
      percentualGordura,
    });
    
    setShowPreview(true);
    toast.success("Métricas calculadas com sucesso!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
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
      
      // Converter dados do formulário para o formato esperado pela API
      const alunoData = {
        nome: form.nome,
        idade: parseInt(form.idade),
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
      };
      
      // Simular um delay para testar o estado de carregamento (remover em produção)
      // await new Promise(resolve => setTimeout(resolve, 1500));
      
      const alunoCadastrado = await cadastrarAluno(alunoData);
      toast.success("Aluno cadastrado com sucesso!");
      navigate("/alunos");
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      toast.error("Erro ao cadastrar aluno. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const niveisExperiencia = [
    { value: "iniciante", label: "Iniciante" },
    { value: "intermediario", label: "Intermediário" },
    { value: "avancado", label: "Avançado" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastrar Novo Aluno</h1>
          <p className="text-gray-600 mt-1">
            Preencha os dados do aluno para cadastro
          </p>
        </div>
        <button
          onClick={() => navigate("/alunos")}
          className="flex items-center gap-1 text-gray-600 hover:text-fitness-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para lista</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Dados Pessoais</h2>
              
              <FormInput
                id="nome"
                label="Nome Completo"
                value={form.nome}
                onChange={handleChange}
                required
                error={errors.nome}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Dobras Cutâneas (mm)</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="mt-4 w-full py-2 bg-fitness-secondary text-white rounded-md hover:bg-fitness-secondary/90 transition-colors"
              >
                Calcular Métricas
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
                  <span>Cadastrar Aluno</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarAluno;

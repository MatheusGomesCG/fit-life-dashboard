
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cadastrarAluno } from "@/services/alunosService";

// Interface para dados do aluno
interface DadosAluno {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: Date | null;
  genero: string;
  endereco: string;
  objetivo: string;
  observacoes: string;
  altura: number;
  peso: number;
  valorMensalidade: number;
  dataVencimento: Date | null;
  // Adicionando campos obrigatórios que faltavam
  idade: number;
  experiencia: "iniciante" | "intermediario" | "avancado";
  dobrasCutaneas: {
    triceps: number;
    subescapular: number;
    axilarMedia: number;
    peitoral: number;
    suprailiaca: number;
    abdominal: number;
    coxa: number;
  };
}

const CadastrarAluno: React.FC = () => {
  const navigate = useNavigate();
  
  const [dadosAluno, setDadosAluno] = useState<DadosAluno>({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: null,
    genero: "",
    endereco: "",
    objetivo: "",
    observacoes: "",
    altura: 0,
    peso: 0,
    valorMensalidade: 0,
    dataVencimento: null,
    // Inicialização dos novos campos obrigatórios
    idade: 0,
    experiencia: "iniciante",
    dobrasCutaneas: {
      triceps: 0,
      subescapular: 0,
      axilarMedia: 0,
      peitoral: 0,
      suprailiaca: 0,
      abdominal: 0,
      coxa: 0
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setDadosAluno(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setDadosAluno(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: string, date: Date | null) => {
    setDadosAluno(prev => ({ ...prev, [field]: date }));
  };

  // Adicionando handler para campos numéricos específicos
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setDadosAluno(prev => ({ ...prev, [id]: Number(value) }));
  };

  // Adicionando handler para dobras cutâneas
  const handleDobrasCutaneasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const dobra = id.replace('dobra-', '');
    setDadosAluno(prev => ({
      ...prev,
      dobrasCutaneas: {
        ...prev.dobrasCutaneas,
        [dobra]: Number(value)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validações básicas
      if (!dadosAluno.nome || !dadosAluno.email || !dadosAluno.telefone) {
        toast.error("Por favor, preencha os campos obrigatórios");
        return;
      }

      // Certificando-se que idade é um número
      if (!dadosAluno.idade || dadosAluno.idade <= 0) {
        toast.error("Por favor, informe uma idade válida");
        return;
      }

      // Formatando o objeto para envio
      const alunoFormatado = {
        ...dadosAluno,
        altura: Number(dadosAluno.altura),
        peso: Number(dadosAluno.peso),
        valorMensalidade: Number(dadosAluno.valorMensalidade),
        idade: Number(dadosAluno.idade)
      };

      await cadastrarAluno(alunoFormatado);
      
      toast.success("Aluno cadastrado com sucesso!");
      navigate("/gerenciar-alunos");
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      toast.error("Erro ao cadastrar aluno. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cadastrar Novo Aluno</h1>
        <p className="text-gray-600 mt-1">Preencha o formulário para cadastrar um novo aluno</p>
      </div>

      <div className="bg-white p-6 rounded-md shadow-md border border-gray-200">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Dados Pessoais */}
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Dados Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div>
                <Label htmlFor="nome">Nome Completo*</Label>
                <Input 
                  id="nome" 
                  placeholder="Nome do aluno" 
                  value={dadosAluno.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">E-mail*</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@exemplo.com" 
                  value={dadosAluno.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Telefone */}
              <div>
                <Label htmlFor="telefone">Telefone*</Label>
                <Input 
                  id="telefone" 
                  placeholder="(00) 00000-0000" 
                  value={dadosAluno.telefone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Idade - Campo Adicionado */}
              <div>
                <Label htmlFor="idade">Idade*</Label>
                <Input 
                  id="idade" 
                  type="number" 
                  placeholder="25" 
                  value={dadosAluno.idade || ''}
                  onChange={handleNumericChange}
                  required
                />
              </div>

              {/* Data de Nascimento */}
              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <DatePicker
                  selected={dadosAluno.dataNascimento}
                  onSelect={(date) => handleDateChange('dataNascimento', date)}
                  placeholder="Selecione uma data"
                />
              </div>

              {/* Gênero */}
              <div>
                <Label htmlFor="genero">Gênero</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('genero', value)}
                  defaultValue={dadosAluno.genero}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Endereço */}
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input 
                  id="endereco" 
                  placeholder="Endereço completo" 
                  value={dadosAluno.endereco}
                  onChange={handleInputChange}
                />
              </div>

              {/* Nível de Experiência - Campo Adicionado */}
              <div>
                <Label htmlFor="experiencia">Nível de Experiência*</Label>
                <Select 
                  onValueChange={(value: "iniciante" | "intermediario" | "avancado") => 
                    handleSelectChange('experiencia', value)
                  }
                  defaultValue={dadosAluno.experiencia}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dados Físicos */}
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Dados Físicos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Altura */}
              <div>
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input 
                  id="altura" 
                  type="number" 
                  placeholder="170"
                  value={dadosAluno.altura || ''}
                  onChange={(e) => setDadosAluno(prev => ({ 
                    ...prev, 
                    altura: Number(e.target.value) 
                  }))}
                />
              </div>

              {/* Peso */}
              <div>
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input 
                  id="peso" 
                  type="number" 
                  placeholder="70"
                  value={dadosAluno.peso || ''}
                  onChange={(e) => setDadosAluno(prev => ({ 
                    ...prev, 
                    peso: Number(e.target.value) 
                  }))}
                />
              </div>
            </div>

            {/* Dobras Cutâneas - Seção Adicionada */}
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-3">Dobras Cutâneas (mm)*</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Triceps */}
                <div>
                  <Label htmlFor="dobra-triceps">Tríceps</Label>
                  <Input 
                    id="dobra-triceps" 
                    type="number" 
                    placeholder="10" 
                    value={dadosAluno.dobrasCutaneas.triceps || ''}
                    onChange={handleDobrasCutaneasChange}
                  />
                </div>
                
                {/* Subescapular */}
                <div>
                  <Label htmlFor="dobra-subescapular">Subescapular</Label>
                  <Input 
                    id="dobra-subescapular" 
                    type="number" 
                    placeholder="12" 
                    value={dadosAluno.dobrasCutaneas.subescapular || ''}
                    onChange={handleDobrasCutaneasChange}
                  />
                </div>
                
                {/* Axilar Média */}
                <div>
                  <Label htmlFor="dobra-axilarMedia">Axilar Média</Label>
                  <Input 
                    id="dobra-axilarMedia" 
                    type="number" 
                    placeholder="8" 
                    value={dadosAluno.dobrasCutaneas.axilarMedia || ''}
                    onChange={handleDobrasCutaneasChange}
                  />
                </div>
                
                {/* Peitoral */}
                <div>
                  <Label htmlFor="dobra-peitoral">Peitoral</Label>
                  <Input 
                    id="dobra-peitoral" 
                    type="number" 
                    placeholder="7" 
                    value={dadosAluno.dobrasCutaneas.peitoral || ''}
                    onChange={handleDobrasCutaneasChange}
                  />
                </div>
                
                {/* Supra-ilíaca */}
                <div>
                  <Label htmlFor="dobra-suprailiaca">Supra-ilíaca</Label>
                  <Input 
                    id="dobra-suprailiaca" 
                    type="number" 
                    placeholder="14" 
                    value={dadosAluno.dobrasCutaneas.suprailiaca || ''}
                    onChange={handleDobrasCutaneasChange}
                  />
                </div>
                
                {/* Abdominal */}
                <div>
                  <Label htmlFor="dobra-abdominal">Abdominal</Label>
                  <Input 
                    id="dobra-abdominal" 
                    type="number" 
                    placeholder="18" 
                    value={dadosAluno.dobrasCutaneas.abdominal || ''}
                    onChange={handleDobrasCutaneasChange}
                  />
                </div>
                
                {/* Coxa */}
                <div>
                  <Label htmlFor="dobra-coxa">Coxa</Label>
                  <Input 
                    id="dobra-coxa" 
                    type="number" 
                    placeholder="15" 
                    value={dadosAluno.dobrasCutaneas.coxa || ''}
                    onChange={handleDobrasCutaneasChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dados de Contrato */}
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Dados de Pagamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Valor da Mensalidade */}
              <div>
                <Label htmlFor="valorMensalidade">Valor da Mensalidade (R$)</Label>
                <Input 
                  id="valorMensalidade" 
                  type="number" 
                  placeholder="100.00"
                  value={dadosAluno.valorMensalidade || ''}
                  onChange={(e) => setDadosAluno(prev => ({ 
                    ...prev, 
                    valorMensalidade: Number(e.target.value) 
                  }))}
                />
              </div>

              {/* Data de Vencimento */}
              <div>
                <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                <DatePicker
                  selected={dadosAluno.dataVencimento}
                  onSelect={(date) => handleDateChange('dataVencimento', date)}
                  placeholder="Selecione a data de vencimento"
                />
              </div>
            </div>
          </div>

          {/* Plano de Treino */}
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Informações do Treino</h2>
            <div className="grid grid-cols-1 gap-6">
              {/* Objetivo */}
              <div>
                <Label htmlFor="objetivo">Objetivo</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('objetivo', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                    <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                    <SelectItem value="condicionamento">Condicionamento Físico</SelectItem>
                    <SelectItem value="reabilitacao">Reabilitação</SelectItem>
                    <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea 
                  id="observacoes" 
                  placeholder="Informações adicionais, restrições médicas, etc."
                  value={dadosAluno.observacoes}
                  onChange={handleInputChange}
                  className="h-32"
                />
              </div>
            </div>
          </div>

          {/* Botão de Cadastrar */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar Aluno"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarAluno;

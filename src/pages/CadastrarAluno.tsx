import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { criarAluno, calcularPercentualGordura } from "@/services/alunosService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const alunoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  idade: z.number().min(1, "Idade deve ser maior que 0"),
  peso: z.number().min(1, "Peso deve ser maior que 0"),
  altura: z.number().min(1, "Altura deve ser maior que 0"),
  objetivo: z.string().min(1, "Objetivo é obrigatório"),
  experiencia: z.string().min(1, "Experiência é obrigatória"),
  restricoes_medicas: z.string(),
  genero: z.enum(["masculino", "feminino"]),
  dataNascimento: z.string(),
  valorMensalidade: z.number().min(0, "Valor deve ser maior ou igual a 0"),
  dataVencimento: z.string(),
  endereco: z.string().optional(),
  observacoes: z.string().optional(),
  // Dobras cutâneas
  triceps: z.number().min(0),
  subescapular: z.number().min(0),
  axilarMedia: z.number().min(0),
  peitoral: z.number().min(0),
  suprailiaca: z.number().min(0),
  abdominal: z.number().min(0),
  coxa: z.number().min(0),
});

type AlunoFormData = z.infer<typeof alunoSchema>;

const CadastrarAluno: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
    defaultValues: {
      restricoes_medicas: "",
      endereco: "",
      observacoes: "",
      triceps: 0,
      subescapular: 0,
      axilarMedia: 0,
      peitoral: 0,
      suprailiaca: 0,
      abdominal: 0,
      coxa: 0,
    }
  });

  const onSubmit = async (data: AlunoFormData) => {
    try {
      setIsLoading(true);

      const dobrasCutaneas = {
        triceps: data.triceps,
        subescapular: data.subescapular,
        axilarMedia: data.axilarMedia,
        peitoral: data.peitoral,
        suprailiaca: data.suprailiaca,
        abdominal: data.abdominal,
        coxa: data.coxa,
      };

      const percentualGordura = calcularPercentualGordura(
        dobrasCutaneas,
        data.genero,
        data.idade
      );

      const novoAluno = {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        idade: data.idade,
        peso: data.peso,
        altura: data.altura,
        objetivo: data.objetivo,
        experiencia: data.experiencia,
        restricoes_medicas: data.restricoes_medicas, // Added this line
        genero: data.genero,
        dataNascimento: new Date(data.dataNascimento),
        valorMensalidade: data.valorMensalidade,
        dataVencimento: new Date(data.dataVencimento),
        endereco: data.endereco || "",
        observacoes: data.observacoes || "",
        dobrasCutaneas,
        percentualGordura
      };

      await criarAluno(novoAluno);
      
      toast.success("Aluno cadastrado com sucesso!");
      navigate("/gerenciar-alunos");
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      toast.error("Erro ao cadastrar aluno. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate("/gerenciar-alunos")}
          className="mr-4 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastrar Novo Aluno</h1>
          <p className="text-gray-600 mt-1">
            Preencha as informações do aluno para criar sua ficha
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Dados básicos do aluno
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  {...register("nome")}
                  placeholder="Digite o nome completo"
                />
                {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Digite o email"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  {...register("telefone")}
                  placeholder="Digite o telefone"
                />
                {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone.message}</p>}
              </div>

              <div>
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  {...register("idade", { valueAsNumber: true })}
                  placeholder="Digite a idade"
                />
                {errors.idade && <p className="text-red-500 text-sm">{errors.idade.message}</p>}
              </div>

              <div>
                <Label htmlFor="genero">Gênero</Label>
                <Select onValueChange={(value) => setValue("genero", value as "masculino" | "feminino")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                {errors.genero && <p className="text-red-500 text-sm">{errors.genero.message}</p>}
              </div>

              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  {...register("dataNascimento")}
                />
                {errors.dataNascimento && <p className="text-red-500 text-sm">{errors.dataNascimento.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                {...register("endereco")}
                placeholder="Digite o endereço completo"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Físicas</CardTitle>
            <CardDescription>
              Medidas e dados físicos do aluno
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  {...register("peso", { valueAsNumber: true })}
                  placeholder="Digite o peso"
                />
                {errors.peso && <p className="text-red-500 text-sm">{errors.peso.message}</p>}
              </div>

              <div>
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input
                  id="altura"
                  type="number"
                  {...register("altura", { valueAsNumber: true })}
                  placeholder="Digite a altura"
                />
                {errors.altura && <p className="text-red-500 text-sm">{errors.altura.message}</p>}
              </div>
            </div>

            <div>
              <Label>Dobras Cutâneas (mm)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div>
                  <Label htmlFor="triceps" className="text-sm">Tríceps</Label>
                  <Input
                    id="triceps"
                    type="number"
                    step="0.1"
                    {...register("triceps", { valueAsNumber: true })}
                    placeholder="mm"
                  />
                </div>
                <div>
                  <Label htmlFor="subescapular" className="text-sm">Subescapular</Label>
                  <Input
                    id="subescapular"
                    type="number"
                    step="0.1"
                    {...register("subescapular", { valueAsNumber: true })}
                    placeholder="mm"
                  />
                </div>
                <div>
                  <Label htmlFor="axilarMedia" className="text-sm">Axilar Média</Label>
                  <Input
                    id="axilarMedia"
                    type="number"
                    step="0.1"
                    {...register("axilarMedia", { valueAsNumber: true })}
                    placeholder="mm"
                  />
                </div>
                <div>
                  <Label htmlFor="peitoral" className="text-sm">Peitoral</Label>
                  <Input
                    id="peitoral"
                    type="number"
                    step="0.1"
                    {...register("peitoral", { valueAsNumber: true })}
                    placeholder="mm"
                  />
                </div>
                <div>
                  <Label htmlFor="suprailiaca" className="text-sm">Suprailíaca</Label>
                  <Input
                    id="suprailiaca"
                    type="number"
                    step="0.1"
                    {...register("suprailiaca", { valueAsNumber: true })}
                    placeholder="mm"
                  />
                </div>
                <div>
                  <Label htmlFor="abdominal" className="text-sm">Abdominal</Label>
                  <Input
                    id="abdominal"
                    type="number"
                    step="0.1"
                    {...register("abdominal", { valueAsNumber: true })}
                    placeholder="mm"
                  />
                </div>
                <div>
                  <Label htmlFor="coxa" className="text-sm">Coxa</Label>
                  <Input
                    id="coxa"
                    type="number"
                    step="0.1"
                    {...register("coxa", { valueAsNumber: true })}
                    placeholder="mm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações de Treino</CardTitle>
            <CardDescription>
              Objetivos e experiência do aluno
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="objetivo">Objetivo</Label>
              <Select onValueChange={(value) => setValue("objetivo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                  <SelectItem value="ganho_massa">Ganho de Massa Muscular</SelectItem>
                  <SelectItem value="condicionamento">Condicionamento Físico</SelectItem>
                  <SelectItem value="reabilitacao">Reabilitação</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                </SelectContent>
              </Select>
              {errors.objetivo && <p className="text-red-500 text-sm">{errors.objetivo.message}</p>}
            </div>

            <div>
              <Label htmlFor="experiencia">Experiência</Label>
              <Select onValueChange={(value) => setValue("experiencia", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a experiência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iniciante">Iniciante</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                </SelectContent>
              </Select>
              {errors.experiencia && <p className="text-red-500 text-sm">{errors.experiencia.message}</p>}
            </div>

            <div>
              <Label htmlFor="restricoes_medicas">Restrições Médicas</Label>
              <Textarea
                id="restricoes_medicas"
                {...register("restricoes_medicas")}
                placeholder="Descreva qualquer restrição médica ou lesão"
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                {...register("observacoes")}
                placeholder="Observações adicionais"
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Financeiras</CardTitle>
            <CardDescription>
              Dados de pagamento e mensalidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valorMensalidade">Valor da Mensalidade (R$)</Label>
                <Input
                  id="valorMensalidade"
                  type="number"
                  step="0.01"
                  {...register("valorMensalidade", { valueAsNumber: true })}
                  placeholder="Digite o valor da mensalidade"
                />
                {errors.valorMensalidade && <p className="text-red-500 text-sm">{errors.valorMensalidade.message}</p>}
              </div>

              <div>
                <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                <Input
                  id="dataVencimento"
                  type="date"
                  {...register("dataVencimento")}
                />
                {errors.dataVencimento && <p className="text-red-500 text-sm">{errors.dataVencimento.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/gerenciar-alunos")}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar Aluno"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CadastrarAluno;

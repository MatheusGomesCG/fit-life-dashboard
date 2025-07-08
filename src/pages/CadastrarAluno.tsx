import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { criarAluno } from "@/services/alunosService";
import { useAuth } from "@/contexts/AuthContext";
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
  objetivo: z.string().min(1, "Objetivo é obrigatório"),
  experiencia: z.string().min(1, "Experiência é obrigatória"),
  restricoes_medicas: z.string(),
  genero: z.enum(["masculino", "feminino"]),
  data_nascimento: z.string(),
  valor_mensalidade: z.number().min(0, "Valor deve ser maior ou igual a 0"),
  data_vencimento: z.string(),
  endereco: z.string().optional(),
  observacoes: z.string().optional(),
});

type AlunoFormData = z.infer<typeof alunoSchema>;

const CadastrarAluno: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
    defaultValues: {
      restricoes_medicas: "",
      endereco: "",
      observacoes: "",
    }
  });

  const onSubmit = async (data: AlunoFormData) => {
    try {
      setIsLoading(true);

      if (!user?.id) {
        toast.error("Usuário não autenticado");
        return;
      }

      const novoAluno = {
        user_id: crypto.randomUUID(), // Generate a new user ID for the student
        professor_id: user.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        idade: data.idade,
        objetivo: data.objetivo,
        experiencia: data.experiencia,
        restricoes_medicas: data.restricoes_medicas,
        genero: data.genero,
        data_nascimento: data.data_nascimento,
        valor_mensalidade: data.valor_mensalidade,
        data_vencimento: data.data_vencimento,
        endereco: data.endereco || "",
        observacoes: data.observacoes || "",
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
            Preencha as informações básicas do aluno para criar sua conta
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
                <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  {...register("data_nascimento")}
                />
                {errors.data_nascimento && <p className="text-red-500 text-sm">{errors.data_nascimento.message}</p>}
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
                <Label htmlFor="valor_mensalidade">Valor da Mensalidade (R$)</Label>
                <Input
                  id="valor_mensalidade"
                  type="number"
                  step="0.01"
                  {...register("valor_mensalidade", { valueAsNumber: true })}
                  placeholder="Digite o valor da mensalidade"
                />
                {errors.valor_mensalidade && <p className="text-red-500 text-sm">{errors.valor_mensalidade.message}</p>}
              </div>

              <div>
                <Label htmlFor="data_vencimento">Data de Vencimento</Label>
                <Input
                  id="data_vencimento"
                  type="date"
                  {...register("data_vencimento")}
                />
                {errors.data_vencimento && <p className="text-red-500 text-sm">{errors.data_vencimento.message}</p>}
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

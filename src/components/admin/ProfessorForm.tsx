
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfessorFormData {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  especialidade: string;
  documento: string;
  endereco: string;
  biografia: string;
}

interface ProfessorFormProps {
  formData: ProfessorFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onGerarSenha: () => void;
  mostrarSenha: boolean;
  setMostrarSenha: (show: boolean) => void;
  isLoading: boolean;
}

const ProfessorForm: React.FC<ProfessorFormProps> = ({
  formData,
  onInputChange,
  onGerarSenha,
  mostrarSenha,
  setMostrarSenha,
  isLoading
}) => {
  return (
    <div className="space-y-6">
      {/* Dados Obrigatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            value={formData.nome}
            onChange={onInputChange}
            placeholder="Digite o nome completo"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            value={formData.email}
            onChange={onInputChange}
            placeholder="professor@email.com"
          />
        </div>
      </div>

      {/* Senha */}
      <div>
        <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
          Senha * (mínimo 6 caracteres)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={mostrarSenha ? "text" : "password"}
              id="senha"
              name="senha"
              required
              disabled={isLoading}
              minLength={6}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={formData.senha}
              onChange={onInputChange}
              placeholder="Digite a senha"
            />
            <button
              type="button"
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 disabled:opacity-50"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            disabled={isLoading}
            onClick={onGerarSenha}
          >
            Gerar
          </Button>
        </div>
      </div>

      {/* Dados Opcionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            value={formData.telefone}
            onChange={onInputChange}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <label htmlFor="especialidade" className="block text-sm font-medium text-gray-700 mb-2">
            Especialidade
          </label>
          <input
            type="text"
            id="especialidade"
            name="especialidade"
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            value={formData.especialidade}
            onChange={onInputChange}
            placeholder="Ex: Musculação, Crossfit, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-2">
            CPF/CNPJ
          </label>
          <input
            type="text"
            id="documento"
            name="documento"
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            value={formData.documento}
            onChange={onInputChange}
            placeholder="000.000.000-00"
          />
        </div>

        <div>
          <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
            Endereço
          </label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            value={formData.endereco}
            onChange={onInputChange}
            placeholder="Rua, número, bairro, cidade"
          />
        </div>
      </div>

      <div>
        <label htmlFor="biografia" className="block text-sm font-medium text-gray-700 mb-2">
          Biografia
        </label>
        <textarea
          id="biografia"
          name="biografia"
          rows={4}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-50"
          value={formData.biografia}
          onChange={onInputChange}
          placeholder="Breve descrição sobre o professor..."
        />
      </div>
    </div>
  );
};

export default ProfessorForm;

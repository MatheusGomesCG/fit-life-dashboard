
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, LogIn } from "lucide-react";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await login(email, senha);
    } catch (error) {
      console.error("Erro no login:", error);
      // O toast de erro já é exibido na função login
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="flex justify-center mb-8">
          <div className="bg-white p-4 rounded-full shadow-md">
            <Activity className="h-12 w-12 text-fitness-primary" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Login</h1>
            <p className="text-gray-600 mt-2">Sistema de Avaliação Física</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="fitness-input w-full"
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <a href="#" className="text-sm text-fitness-secondary hover:text-fitness-primary">
                  Esqueceu a senha?
                </a>
              </div>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="fitness-input w-full"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 focus:outline-none focus:ring-2 focus:ring-fitness-primary focus:ring-offset-2 transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Entrar
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-6 text-sm text-gray-600">
          Sistema desenvolvido para avaliação física de academia
        </p>
      </div>
    </div>
  );
};

export default Login;

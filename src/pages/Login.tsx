
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Activity, LogIn } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Credenciais inválidas. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Activity className="h-12 w-12 text-fitness-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            FitLife
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Avaliação Física
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="fitness-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="fitness-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="fitness-label">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="fitness-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-fitness-primary hover:bg-fitness-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fitness-primary"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner size="small" className="mx-auto" />
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  <span>Entrar</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              É um professor novo?{" "}
              <Link to="/cadastrar-professor" className="text-fitness-secondary hover:underline">
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

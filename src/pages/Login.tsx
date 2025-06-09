
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Activity, LogIn, ArrowLeft } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get("tipo") || "aluno";

  // Redirecionar se já estiver logado
  React.useEffect(() => {
    if (user?.tipo) {
      if (user.tipo === "professor") {
        navigate("/dashboard-professor", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔐 [Login] Tentando fazer login...");
      
      const { error } = await login(email, password);
      
      if (error) {
        console.error("❌ [Login] Erro:", error);
        toast.error(error.message || "Erro no login");
        return;
      }
      
      console.log("✅ [Login] Login iniciado com sucesso");
      toast.success("Login realizado com sucesso!");
      
      // O redirecionamento será feito pelo useEffect quando o user for carregado
      
    } catch (error: any) {
      console.error("❌ [Login] Erro:", error);
      toast.error("Erro inesperado no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Activity className="h-12 w-12 text-fitness-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            GymCloud
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {userType === "professor" ? "Acesso para Professores" : "Acesso para Alunos"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-fitness-primary hover:bg-fitness-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fitness-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

          <div className="flex justify-center">
            <Link to="/" className="text-sm text-fitness-secondary hover:underline flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Voltar à página inicial</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

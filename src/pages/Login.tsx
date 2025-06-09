
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
  const { login, user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get("tipo") || "aluno";

  // Redirecionar se já estiver logado
  React.useEffect(() => {
    console.log("🔍 [Login] Verificando redirecionamento:", {
      isAuthenticated,
      userTipo: user?.tipo,
      hasUser: !!user
    });

    if (isAuthenticated && user?.tipo) {
      console.log("✅ [Login] Redirecionando usuário autenticado:", user.tipo);
      
      if (user.tipo === "professor") {
        navigate("/dashboard-professor", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user?.tipo, navigate]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔐 [Login] Tentando fazer login...");
      
      const { error, user: loggedUser } = await login(email, password);
      
      if (error) {
        console.error("❌ [Login] Erro:", error);
        
        // Mensagens de erro mais amigáveis
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos. Verifique seus dados e tente novamente.");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Email não confirmado. Verifique sua caixa de entrada.");
        } else if (error.message.includes("Too many requests")) {
          toast.error("Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.");
        } else {
          toast.error("Erro no login. Tente novamente.");
        }
        return;
      }
      
      console.log("✅ [Login] Login realizado com sucesso");
      toast.success("Login realizado com sucesso!");
      
      // Se temos o usuário retornado e ele tem tipo, redirecionar imediatamente
      if (loggedUser?.email) {
        console.log("🎯 [Login] Redirecionamento direto baseado no tipo da página");
        
        // Redirecionar baseado no tipo da página de login
        if (userType === "professor") {
          console.log("➡️ [Login] Redirecionando para dashboard professor");
          navigate("/dashboard-professor", { replace: true });
        } else {
          console.log("➡️ [Login] Redirecionando para dashboard aluno");
          navigate("/dashboard", { replace: true });
        }
      }
      
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

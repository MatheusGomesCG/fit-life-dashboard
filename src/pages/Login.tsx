
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Activity, LogIn, ArrowLeft, Shield, Users, Dumbbell } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import GoogleLoginButton from "@/components/GoogleLoginButton";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get user type from query string (?tipo=aluno, ?tipo=professor, ?tipo=admin)
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get("tipo") || "aluno";
  
  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Usuário já logado, redirecionando...");
      if (user.tipo === "admin") {
        navigate("/admin/dashboard");
      } else if (user.tipo === "professor") {
        navigate("/dashboard-professor");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  // Log to debug the userType
  useEffect(() => {
    console.log("Current userType:", userType);
  }, [userType]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Tentando fazer login...");
      // Call login function with only email and password
      const { error } = await login(email, password);
      
      if (error) {
        throw error;
      }
      
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Credenciais inválidas. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getLoginInfo = () => {
    switch (userType) {
      case "admin":
        return {
          title: "Acesso Administrativo",
          subtitle: "Painel de administração do sistema",
          icon: Shield,
          color: "text-red-600"
        };
      case "professor":
        return {
          title: "Acesso para Professores", 
          subtitle: "Gerencie seus alunos e treinos",
          icon: Users,
          color: "text-blue-600"
        };
      default:
        return {
          title: "Acesso para Alunos",
          subtitle: "Acompanhe seus treinos e progresso", 
          icon: Dumbbell,
          color: "text-green-600"
        };
    }
  };

  const loginInfo = getLoginInfo();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Activity className="h-12 w-12 text-fitness-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            GymCloud
          </h1>
          <div className="mt-2 flex items-center justify-center gap-2">
            <loginInfo.icon className={`h-5 w-5 ${loginInfo.color}`} />
            <p className="text-sm text-gray-600">
              {loginInfo.title}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {loginInfo.subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {/* Botão de login com Google */}
          <GoogleLoginButton />

          {/* Divisor */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Formulário de login tradicional */}
          <form className="space-y-6" onSubmit={handleSubmit}>
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
          </form>
        </div>

        <div className="flex justify-center">
          <Link to="/" className="text-sm text-fitness-secondary hover:underline flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Voltar</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;


import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Activity, LogIn, ArrowLeft, AlertCircle } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get("tipo") || "aluno";
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setDebugInfo("");

    try {
      console.log("🔐 [Login] Tentando fazer login...");
      console.log("📧 [Login] Email:", email);
      console.log("🔗 [Login] URL atual:", window.location.href);
      
      const { error, user: loggedInUser } = await login(email, password);
      
      if (error) {
        console.error("❌ [Login] Erro no login:", error);
        
        // Informações de debug para o usuário
        const debugMessage = `
Detalhes do erro:
- Mensagem: ${error.message}
- Email utilizado: ${email}
- Timestamp: ${new Date().toISOString()}
- URL da aplicação: ${window.location.origin}
        `.trim();
        
        setDebugInfo(debugMessage);
        
        // Mensagem de erro específica baseada no tipo de erro
        let userErrorMessage = "Erro no login. Tente novamente.";
        
        if (error.message.includes("Credenciais inválidas")) {
          userErrorMessage = "Email ou senha incorretos. Verifique os dados e tente novamente.";
        } else if (error.message.includes("Email não confirmado")) {
          userErrorMessage = "Confirme seu email antes de fazer login. Verifique sua caixa de entrada.";
        } else if (error.message.includes("Muitas tentativas")) {
          userErrorMessage = "Muitas tentativas de login. Aguarde alguns minutos.";
        } else if (error.message.includes("configuração")) {
          userErrorMessage = "Erro de configuração do sistema. Entre em contato com o suporte.";
        } else if (error.message.includes("conexão")) {
          userErrorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
        }
        
        toast.error(userErrorMessage);
        throw error;
      }
      
      if (loggedInUser?.tipo) {
        console.log("✅ [Login] Login realizado com sucesso! Tipo:", loggedInUser.tipo);
        toast.success("Login realizado com sucesso!");
        
        // Aguardar um pouco para o toast aparecer antes do redirecionamento
        setTimeout(() => {
          // Redirecionamento baseado no tipo de usuário
          if (loggedInUser.tipo === "professor") {
            console.log("👨‍🏫 [Login] Redirecionando professor para dashboard-professor");
            navigate("/dashboard-professor", { replace: true });
          } else if (loggedInUser.tipo === "aluno") {
            console.log("👨‍🎓 [Login] Redirecionando aluno para dashboard");
            navigate("/dashboard", { replace: true });
          } else if (loggedInUser.tipo === "admin") {
            console.log("👨‍💼 [Login] Redirecionando admin para dashboard");
            navigate("/dashboard", { replace: true });
          } else {
            console.log("❓ [Login] Tipo de usuário não reconhecido:", loggedInUser.tipo);
            toast.error("Tipo de usuário não reconhecido. Entre em contato com o suporte.");
          }
        }, 1000);
      } else {
        console.error("⚠️ [Login] Login bem-sucedido mas tipo de usuário não identificado");
        toast.error("Perfil de usuário não encontrado no banco de dados. Entre em contato com o suporte.");
      }
    } catch (error: any) {
      console.error("❌ [Login] Erro no login:", error);
      // O erro já foi tratado acima, não precisa fazer nada aqui
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
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-fitness-primary hover:bg-fitness-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fitness-primary disabled:opacity-50 disabled:cursor-not-allowed"
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

          {debugInfo && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Informações de Debug
                  </h3>
                  <pre className="text-xs text-red-700 whitespace-pre-wrap font-mono">
                    {debugInfo}
                  </pre>
                </div>
              </div>
            </div>
          )}

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

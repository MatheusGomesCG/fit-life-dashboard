
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";

const API_URL = "https://api.example.com"; // Substitua pela sua URL real da API

interface User {
  id: string;
  nome: string;
  email: string;
  tipo: "aluno" | "professor";
  professorId?: string; // ID do professor que cadastrou o aluno (apenas para alunos)
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string, tipo?: "aluno" | "professor") => Promise<void>;
  logout: () => void;
  loading: boolean;
  register: (data: { email: string, password: string, userData: Partial<User> }) => Promise<void>;
  registerAluno: (data: { 
    nome: string, 
    email: string, 
    senha: string,
    idade: number,
    peso: number,
    altura: number,
    experiencia: string
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock student credentials for testing
const STUDENT_EMAIL = "aluno@exemplo.com";
const STUDENT_PASSWORD = "123456";

// Mock professor credentials for testing
const PROFESSOR_EMAIL = "professor@exemplo.com";
const PROFESSOR_PASSWORD = "123456";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Remove direct useNavigate and useLocation calls here
  // We'll use window.location for navigation instead
  
  // Carregar token do localStorage na inicialização
  useEffect(() => {
    const storedToken = localStorage.getItem("fitnessToken");
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Configurar interceptor para incluir o token em todas as requisições
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  const fetchUserData = async (authToken: string) => {
    try {
      setLoading(true);
      // Esta rota deve existir no seu backend para retornar os dados do usuário autenticado
      const response = await axios.get(`${API_URL}/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error);
      
      // Retrieve user data from localStorage if API call fails
      const userData = localStorage.getItem("fitnessUser");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        logout(); // Se falhar ao obter dados do usuário, fazer logout
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, senha: string, tipo: "aluno" | "professor" = "professor") => {
    try {
      setLoading(true);
      
      // Mock login for professor account
      if (email === PROFESSOR_EMAIL && senha === PROFESSOR_PASSWORD) {
        tipo = "professor";
      }
      
      // Mock login for student account
      if (email === STUDENT_EMAIL && senha === STUDENT_PASSWORD) {
        tipo = "aluno";
      }
      
      // Mock response for development
      const mockResponse = {
        token: "mock_token_" + Math.random(),
        user: {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          nome: email === PROFESSOR_EMAIL ? "Professor Silva" : 
                email === STUDENT_EMAIL ? "Aluno Carlos" :
                email.split("@")[0],
          email,
          tipo
        }
      };
      
      // Em produção, descomentar esta chamada API:
      // const response = await axios.post(`${API_URL}/auth/login`, {
      //   email,
      //   senha,
      //   tipo
      // });
      // const { token: authToken, user: userData } = response.data;
      
      const { token: authToken, user: userData } = mockResponse;
      
      localStorage.setItem("fitnessToken", authToken);
      localStorage.setItem("fitnessUser", JSON.stringify(userData)); // Store user in localStorage
      setToken(authToken);
      setUser(userData);
      
      toast.success("Login realizado com sucesso!");
      
      // Use window.location instead of navigate
      setTimeout(() => {
        const route = userData.tipo === "professor" ? "/dashboard-professor" : "/dashboard";
        window.location.href = route;
      }, 100);
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Adding the register function with improved navigation
  const register = async (data: { email: string, password: string, userData: Partial<User> }) => {
    try {
      setLoading(true);
      
      // Para fins de demonstração/mock (substituir pela chamada API real):
      // Simulando uma resposta de sucesso do servidor
      const mockResponse = {
        token: "mock_token_" + Math.random(),
        user: {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          nome: data.userData.nome || "",
          email: data.email,
          tipo: data.userData.tipo || "professor"
        }
      };
      
      // Na implementação real, use esta chamada:
      // const response = await axios.post(`${API_URL}/auth/register`, {
      //   email: data.email,
      //   senha: data.password,
      //   ...data.userData
      // });
      
      const { token: authToken } = mockResponse;
      
      // Salvamos o token e definimos o usuário diretamente para evitar outra chamada API
      localStorage.setItem("fitnessToken", authToken);
      localStorage.setItem("fitnessUser", JSON.stringify(mockResponse.user)); // Store user in localStorage
      setToken(authToken);
      setUser(mockResponse.user as User);
      
      toast.success("Cadastro realizado com sucesso!");
      
      // Não redirecionamos aqui - deixamos o componente fazer isso após a conclusão
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro ao cadastrar. Por favor, tente novamente.");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to register a student by a professor
  const registerAluno = async (data: { 
    nome: string, 
    email: string, 
    senha: string,
    idade: number,
    peso: number,
    altura: number,
    experiencia: string 
  }) => {
    try {
      setLoading(true);
      
      if (!user || user.tipo !== "professor") {
        throw new Error("Apenas professores podem cadastrar alunos");
      }
      
      // Mock response for development
      const alunoId = "aluno_" + Math.random().toString(36).substr(2, 9);
      
      // Em produção, descomentar esta chamada API:
      // const response = await axios.post(`${API_URL}/auth/register-aluno`, {
      //   ...data,
      //   professorId: user.id
      // });
      // const alunoId = response.data.id;
      
      toast.success("Aluno cadastrado com sucesso!");
      // Return void instead of alunoId to match the function signature
      return;
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      toast.error("Erro ao cadastrar aluno. Por favor, tente novamente.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("fitnessToken");
    localStorage.removeItem("fitnessUser");
    setToken(null);
    setUser(null);
    
    // Use window.location instead of navigate
    window.location.href = "/";
    toast.info("Você saiu do sistema.");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
        register,
        registerAluno,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

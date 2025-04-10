
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const API_URL = "https://api.example.com"; // Substitua pela sua URL real da API

interface User {
  id: string;
  nome: string;
  email: string;
  tipo?: "aluno" | "professor"; // Added tipo property which can be "aluno" or "professor"
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  register: (data: { email: string, password: string, userData: Partial<User> }) => Promise<void>; // Added register function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      logout(); // Se falhar ao obter dados do usuário, fazer logout
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        senha,
      });
      
      const { token: authToken } = response.data;
      
      localStorage.setItem("fitnessToken", authToken);
      setToken(authToken);
      await fetchUserData(authToken);
      
      toast.success("Login realizado com sucesso!");
      
      // Usar setTimeout para evitar erros de renderização
      const userType = response.data.user?.tipo || "professor";
      setTimeout(() => {
        if (userType === "professor") {
          navigate("/dashboard-professor");
        } else {
          navigate("/dashboard");
        }
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

  const logout = useCallback(() => {
    localStorage.removeItem("fitnessToken");
    setToken(null);
    setUser(null);
    navigate("/login");
    toast.info("Você saiu do sistema.");
  }, [navigate]);

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

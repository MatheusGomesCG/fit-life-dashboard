
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
import { toast } from "sonner";
import { registrarCheckinExercicio, verificarExercicioRealizado } from "@/services/checkinService";
import { useAuth } from "@/contexts/AuthContext";

interface CheckinExercicioProps {
  exerciseId: string;
  exerciseName: string;
  onCheckin?: () => void;
}

const CheckinExercicio: React.FC<CheckinExercicioProps> = ({
  exerciseId,
  exerciseName,
  onCheckin
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRealizado, setIsRealizado] = useState(false);
  const [verificandoStatus, setVerificandoStatus] = useState(true);

  const dataHoje = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const verificarStatus = async () => {
      if (user?.id && exerciseId && exerciseId !== 'undefined') {
        try {
          console.log("🔍 [CheckinExercicio] Verificando status:", { 
            userId: user.id, 
            exerciseId, 
            exerciseName 
          });
          
          const realizado = await verificarExercicioRealizado(user.id, exerciseId, dataHoje);
          setIsRealizado(realizado);
        } catch (error) {
          console.error("❌ [CheckinExercicio] Erro ao verificar status do exercício:", error);
        } finally {
          setVerificandoStatus(false);
        }
      } else {
        console.log("⚠️ [CheckinExercicio] Dados inválidos:", { 
          hasUser: !!user?.id, 
          exerciseId, 
          exerciseName 
        });
        setVerificandoStatus(false);
      }
    };

    verificarStatus();
  }, [user?.id, exerciseId, dataHoje, exerciseName]);

  const handleCheckin = async () => {
    if (!user?.id || !exerciseId || exerciseId === 'undefined' || isRealizado) {
      console.log("⚠️ [CheckinExercicio] Não é possível fazer checkin:", {
        hasUser: !!user?.id,
        exerciseId,
        isRealizado
      });
      toast.error("Não é possível registrar este exercício.");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔄 [CheckinExercicio] Iniciando checkin:", {
        userId: user.id,
        exerciseId,
        exerciseName
      });

      await registrarCheckinExercicio(user.id, exerciseId);
      setIsRealizado(true);
      toast.success(`Exercício "${exerciseName}" marcado como realizado!`);
      onCheckin?.();
    } catch (error) {
      console.error("❌ [CheckinExercicio] Erro ao fazer checkin:", error);
      toast.error("Erro ao registrar exercício. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (verificandoStatus) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Clock className="w-4 h-4 mr-2" />
        Verificando...
      </Button>
    );
  }

  // Se não temos um ID válido para o exercício, não mostramos o botão
  if (!exerciseId || exerciseId === 'undefined') {
    console.log("⚠️ [CheckinExercicio] Exercise ID inválido:", exerciseId);
    return null;
  }

  return (
    <Button
      variant={isRealizado ? "default" : "outline"}
      size="sm"
      onClick={handleCheckin}
      disabled={isLoading || isRealizado}
      className={isRealizado ? "bg-green-500 hover:bg-green-600 text-white" : ""}
    >
      <Check className="w-4 h-4 mr-2" />
      {isRealizado ? "Concluído" : isLoading ? "Registrando..." : "Marcar como feito"}
    </Button>
  );
};

export default CheckinExercicio;

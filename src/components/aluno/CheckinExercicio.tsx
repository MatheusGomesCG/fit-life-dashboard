
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
      if (user?.id) {
        try {
          const realizado = await verificarExercicioRealizado(user.id, exerciseId, dataHoje);
          setIsRealizado(realizado);
        } catch (error) {
          console.error("Erro ao verificar status do exercício:", error);
        } finally {
          setVerificandoStatus(false);
        }
      }
    };

    verificarStatus();
  }, [user?.id, exerciseId, dataHoje]);

  const handleCheckin = async () => {
    if (!user?.id || isRealizado) return;

    setIsLoading(true);
    try {
      await registrarCheckinExercicio(user.id, exerciseId);
      setIsRealizado(true);
      toast.success(`Exercício "${exerciseName}" marcado como realizado!`);
      onCheckin?.();
    } catch (error) {
      console.error("Erro ao fazer checkin:", error);
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


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { enviarFeedback } from "@/services/feedbackService";
import { useAuth } from "@/contexts/AuthContext";

interface FeedbackTreinoProps {
  exerciseId?: string;
  exerciseName?: string;
}

const FeedbackTreino: React.FC<FeedbackTreinoProps> = ({ exerciseId, exerciseName }) => {
  const { user } = useAuth();
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !mensagem.trim()) {
      toast.error("Por favor, escreva uma mensagem.");
      return;
    }

    setIsLoading(true);
    try {
      await enviarFeedback({
        user_id: user.id,
        tipo: exerciseId ? "exercicio" : "geral",
        mensagem: mensagem.trim(),
        exercise_id: exerciseId
      });

      toast.success("Feedback enviado com sucesso!");
      setMensagem("");
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      toast.error("Erro ao enviar feedback. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showForm) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowForm(true)}
        className="w-full sm:w-auto text-xs"
      >
        <MessageSquare className="w-3 h-3 mr-1" />
        Feedback
      </Button>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-3 space-y-3 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Enviar Feedback</span>
        </div>
        <button
          onClick={() => {
            setShowForm(false);
            setMensagem("");
          }}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕
        </button>
      </div>

      {exerciseName && (
        <p className="text-xs text-gray-600">
          Feedback sobre: <strong>{exerciseName}</strong>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder={
            exerciseId 
              ? "Como foi este exercício? Teve alguma dificuldade?"
              : "Como foi seu treino hoje? Compartilhe suas impressões..."
          }
          rows={3}
          required
          className="text-sm"
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isLoading || !mensagem.trim()}
            size="sm"
            className="flex-1"
          >
            <Send className="w-3 h-3 mr-1" />
            {isLoading ? "Enviando..." : "Enviar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setShowForm(false);
              setMensagem("");
            }}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackTreino;

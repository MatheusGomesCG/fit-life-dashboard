
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [tipo, setTipo] = useState<"geral" | "exercicio">(exerciseId ? "exercicio" : "geral");
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        tipo,
        mensagem: mensagem.trim(),
        exercise_id: tipo === "exercicio" ? exerciseId : undefined
      });

      toast.success("Feedback enviado com sucesso!");
      setMensagem("");
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      toast.error("Erro ao enviar feedback. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Enviar Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!exerciseId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Feedback
              </label>
              <Select value={tipo} onValueChange={(value: "geral" | "exercicio") => setTipo(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Feedback Geral do Treino</SelectItem>
                  <SelectItem value="exercicio">Feedback de Exercício Específico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {exerciseName && (
            <p className="text-sm text-gray-600">
              Enviando feedback sobre: <strong>{exerciseName}</strong>
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sua Mensagem
            </label>
            <Textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder={
                tipo === "geral" 
                  ? "Como foi seu treino hoje? Compartilhe suas impressões..."
                  : "Como foi este exercício? Teve alguma dificuldade?"
              }
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !mensagem.trim()}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? "Enviando..." : "Enviar Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackTreino;


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Check } from "lucide-react";
import { toast } from "sonner";
import { enviarComprovantePagamento } from "@/services/pagamentosService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ComprovanteUpload: React.FC = () => {
  const { user } = useAuth();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [mesReferencia, setMesReferencia] = useState("");
  const [uploading, setUploading] = useState(false);

  const meses = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" }
  ];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !arquivo || !mesReferencia) {
      toast.error("Por favor, selecione um arquivo e o mês de referência.");
      return;
    }

    // Verificar tipo de arquivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!tiposPermitidos.includes(arquivo.type)) {
      toast.error("Apenas arquivos PDF e imagens (PNG, JPG, JPEG) são permitidos.");
      return;
    }

    // Verificar tamanho (máximo 5MB)
    if (arquivo.size > 5 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 5MB.");
      return;
    }

    setUploading(true);
    try {
      // Primeiro encontrar o pagamento do mês
      const ano = new Date().getFullYear();
      const { data: pagamentos } = await supabase
        .from('pagamentos')
        .select('id')
        .eq('aluno_id', user.id)
        .eq('mes', parseInt(mesReferencia))
        .eq('ano', ano)
        .limit(1);

      if (!pagamentos || pagamentos.length === 0) {
        toast.error("Nenhum pagamento encontrado para este mês.");
        return;
      }

      await enviarComprovantePagamento(pagamentos[0].id, arquivo);
      
      toast.success("Comprovante enviado com sucesso!");
      setArquivo(null);
      setMesReferencia("");
      
      // Resetar o input file
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error("Erro ao enviar comprovante:", error);
      toast.error("Erro ao enviar comprovante. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Enviar Comprovante
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mês de Referência
            </label>
            <Select value={mesReferencia} onValueChange={setMesReferencia}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                {meses.map(mes => (
                  <SelectItem key={mes.value} value={mes.value}>
                    {mes.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comprovante (PDF ou Imagem)
            </label>
            <Input
              id="file-input"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setArquivo(e.target.files?.[0] || null)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Arquivos aceitos: PDF, PNG, JPG, JPEG (máx. 5MB)
            </p>
          </div>

          {arquivo && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700 truncate">
                {arquivo.name}
              </span>
              <span className="text-xs text-gray-500">
                ({(arquivo.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}

          <Button
            type="submit"
            disabled={uploading || !arquivo || !mesReferencia}
            className="w-full"
          >
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Enviar Comprovante
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ComprovanteUpload;

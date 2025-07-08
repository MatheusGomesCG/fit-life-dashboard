
import { supabase } from "@/integrations/supabase/client";

export const enviarComprovantePagamento = async (pagamentoId: string, arquivo: File): Promise<void> => {
  try {
    // Upload do arquivo para o storage
    const fileExt = arquivo.name.split('.').pop();
    const fileName = `comprovantes/${pagamentoId}/${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('comprovantes-pagamento')
      .upload(fileName, arquivo);

    if (uploadError) throw uploadError;

    // Obter URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from('comprovantes-pagamento')
      .getPublicUrl(fileName);

    // Atualizar o registro de pagamento com a URL do comprovante
    const { error: updateError } = await supabase
      .from('pagamentos')
      .update({
        comprovante_url: urlData.publicUrl,
        status: 'enviado'
      })
      .eq('id', pagamentoId);

    if (updateError) throw updateError;

  } catch (error) {
    console.error("Erro ao enviar comprovante:", error);
    throw error;
  }
};

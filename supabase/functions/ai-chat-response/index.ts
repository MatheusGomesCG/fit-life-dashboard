
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🤖 Iniciando resposta da IA...');
    
    const { message, conversaId, alunoNome, contexto } = await req.json();
    console.log('📝 Dados recebidos:', { message, conversaId, alunoNome });
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('❌ Chave da API Gemini não configurada');
      throw new Error('Gemini API key not configured');
    }

    console.log('🔑 Chave da API encontrada, fazendo chamada para Gemini...');

    // Create a contextual prompt for the AI
    const systemPrompt = `Você é um assistente de professor de academia/personal trainer. 
    Você está conversando com o aluno ${alunoNome}. 
    Seja útil, motivador e profissional. 
    Responda perguntas sobre exercícios, treinos, nutrição básica e motivação.
    Se a pergunta não for relacionada a fitness, educadamente redirecione para tópicos de treino.
    Mantenha respostas concisas e práticas.
    ${contexto ? `Contexto adicional: ${contexto}` : ''}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
    console.log('🌐 URL da API Gemini:', geminiUrl.replace(geminiApiKey, 'API_KEY_HIDDEN'));

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nMensagem do aluno: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    console.log('📡 Status da resposta da API:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na API Gemini:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📊 Resposta da API recebida:', JSON.stringify(data, null, 2));
    
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      console.error('❌ Nenhuma resposta da API Gemini');
      throw new Error('No response from Gemini API');
    }

    console.log('✅ Resposta da IA gerada:', aiResponse);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the professor ID from the conversation
    const { data: conversa, error: conversaError } = await supabase
      .from('conversas')
      .select('professor_id, aluno_id')
      .eq('id', conversaId)
      .single();

    if (conversaError || !conversa) {
      console.error('❌ Erro ao buscar conversa:', conversaError);
      throw new Error('Conversation not found');
    }

    console.log('💬 Conversa encontrada:', conversa);

    // Save AI response as a message from the professor
    const { data: mensagem, error: mensagemError } = await supabase
      .from('mensagens')
      .insert({
        conversa_id: conversaId,
        remetente_id: conversa.professor_id,
        destinatario_id: conversa.aluno_id,
        conteudo: `🤖 ${aiResponse}`,
        lida: false,
        tipo: 'texto'
      })
      .select()
      .single();

    if (mensagemError) {
      console.error('❌ Erro ao salvar mensagem da IA:', mensagemError);
      throw new Error('Error saving AI response');
    }

    console.log('💾 Mensagem da IA salva:', mensagem);

    // Update conversation with last message
    await supabase
      .from('conversas')
      .update({
        ultima_mensagem: `🤖 ${aiResponse}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversaId);

    console.log('🔄 Conversa atualizada com última mensagem');

    return new Response(JSON.stringify({ 
      success: true, 
      response: aiResponse,
      mensagem 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erro na função ai-chat-response:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

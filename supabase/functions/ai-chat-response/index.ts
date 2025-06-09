
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
    const { message, conversaId, alunoNome, contexto } = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Create a contextual prompt for the AI
    const systemPrompt = `Você é um assistente de professor de academia/personal trainer. 
    Você está conversando com o aluno ${alunoNome}. 
    Seja útil, motivador e profissional. 
    Responda perguntas sobre exercícios, treinos, nutrição básica e motivação.
    Se a pergunta não for relacionada a fitness, educadamente redirecione para tópicos de treino.
    Mantenha respostas concisas e práticas.
    ${contexto ? `Contexto adicional: ${contexto}` : ''}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
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

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error('No response from Gemini API');
    }

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
      throw new Error('Conversation not found');
    }

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
      throw new Error('Error saving AI response');
    }

    // Update conversation with last message
    await supabase
      .from('conversas')
      .update({
        ultima_mensagem: `🤖 ${aiResponse}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversaId);

    return new Response(JSON.stringify({ 
      success: true, 
      response: aiResponse,
      mensagem 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat-response:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

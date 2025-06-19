
import jsPDF from "jspdf";
import { AvaliacaoCompleta, DadoAvaliacao } from "./avaliacaoService";

export const gerarPDFAvaliacao = (avaliacao: AvaliacaoCompleta): jsPDF => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Avaliação Física", 105, 20, { align: "center" });
  
  // Informações do aluno
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Aluno: ${avaliacao.aluno_nome}`, 20, 40);
  doc.text(`Email: ${avaliacao.aluno_email}`, 20, 48);
  doc.text(`Data da Avaliação: ${new Date(avaliacao.data_avaliacao).toLocaleDateString("pt-BR")}`, 20, 56);
  
  // Observações
  if (avaliacao.observacoes) {
    doc.setFont("helvetica", "bold");
    doc.text("Observações:", 20, 72);
    doc.setFont("helvetica", "normal");
    
    // Quebrar texto das observações em linhas
    const observacoes = doc.splitTextToSize(avaliacao.observacoes, 170);
    doc.text(observacoes, 20, 80);
  }
  
  // Dados agrupados
  const dadosAgrupados = agruparDadosPorGrupo(avaliacao.dados);
  let currentY = avaliacao.observacoes ? 100 : 80;
  
  Object.entries(dadosAgrupados).forEach(([grupo, estrategias]) => {
    // Verificar se precisa de nova página
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    // Cabeçalho do grupo
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(grupo, 20, currentY);
    currentY += 10;
    
    // Linha horizontal
    doc.line(20, currentY, 190, currentY);
    currentY += 5;
    
    // Dados do grupo
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    estrategias.forEach((estrategia) => {
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      
      const valor = estrategia.valor_texto || `${estrategia.valor}`;
      const unidadeTexto = estrategia.unidade !== "texto" ? ` ${estrategia.unidade}` : "";
      
      doc.text(`${estrategia.estrategia}: ${valor}${unidadeTexto}`, 25, currentY);
      currentY += 6;
    });
    
    currentY += 5; // Espaço entre grupos
  });
  
  // Rodapé
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(`Página ${i} de ${totalPages}`, 105, 285, { align: "center" });
    doc.text("Avaliação gerada pelo Sistema de Avaliação Física", 105, 290, { align: "center" });
  }
  
  return doc;
};

const agruparDadosPorGrupo = (dados: DadoAvaliacao[]) => {
  return dados.reduce((acc, item) => {
    if (!acc[item.grupo_estrategia]) {
      acc[item.grupo_estrategia] = [];
    }
    acc[item.grupo_estrategia].push(item);
    return acc;
  }, {} as Record<string, DadoAvaliacao[]>);
};

export const downloadPDFAvaliacao = (doc: jsPDF, filename: string): void => {
  doc.save(filename);
};

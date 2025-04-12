
import jsPDF from "jspdf";
import { Aluno, FichaTreino } from "./alunosService";

export const gerarPDFFichaTreino = (ficha: FichaTreino): jsPDF => {
  const { aluno, dataAvaliacao, exercicios } = ficha;
  
  // Criar um novo documento PDF
  const doc = new jsPDF();
  
  // Adicionar título
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Ficha de Treino", 105, 20, { align: "center" });
  
  // Informações do aluno
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Nome: ${aluno.nome}`, 20, 40);
  doc.text(`Data da Avaliação: ${new Date(dataAvaliacao).toLocaleDateString("pt-BR")}`, 20, 48);
  doc.text(`Idade: ${aluno.idade} anos`, 20, 56);
  doc.text(`Peso: ${aluno.peso} kg`, 20, 64);
  doc.text(`Altura: ${aluno.altura} cm`, 20, 72);
  doc.text(`IMC: ${aluno.imc?.toFixed(2)}`, 20, 80);
  doc.text(`Percentual de Gordura: ${aluno.percentualGordura?.toFixed(2)}%`, 20, 88);
  doc.text(`Nível de Experiência: ${aluno.experiencia}`, 20, 96);
  
  // Cabeçalho da tabela de exercícios
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Ficha de Treino Recomendada", 105, 115, { align: "center" });
  
  // Tabela de exercícios
  const startY = 125;
  const rowHeight = 8;
  const colWidth = [50, 40, 25, 20, 25];
  const colStart = [15, 65, 105, 130, 150];
  
  // Cabeçalho da tabela
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Exercício", colStart[0], startY);
  doc.text("Dia do Treino", colStart[1], startY);
  doc.text("Carga (kg)", colStart[2], startY);
  doc.text("Séries", colStart[3], startY);
  doc.text("Repetições", colStart[4], startY);
  
  // Linhas horizontais
  doc.line(15, startY + 2, 190, startY + 2);
  
  // Dados da tabela
  doc.setFont("helvetica", "normal");
  let currentY = startY + rowHeight;
  
  // Agrupar exercícios por grupo muscular
  const exerciciosPorGrupo: Record<string, typeof exercicios> = {};
  exercicios.forEach((exercicio) => {
    if (!exerciciosPorGrupo[exercicio.grupoMuscular]) {
      exerciciosPorGrupo[exercicio.grupoMuscular] = [];
    }
    exerciciosPorGrupo[exercicio.grupoMuscular].push(exercicio);
  });
  
  let paginaAtual = 1;
  const maxY = 270; // Altura máxima antes de criar nova página
  
  // Função para adicionar cabeçalho em novas páginas
  const adicionarCabecalho = () => {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Ficha de Treino - Continuação", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.text("Exercício", colStart[0], 30);
    doc.text("Dia do Treino", colStart[1], 30);
    doc.text("Carga (kg)", colStart[2], 30);
    doc.text("Séries", colStart[3], 30);
    doc.text("Repetições", colStart[4], 30);
    
    doc.line(15, 32, 190, 32);
    
    return 40; // Nova posição Y após o cabeçalho
  };
  
  // Adicionar exercícios agrupados por grupo muscular
  Object.entries(exerciciosPorGrupo).forEach(([grupo, exerciciosGrupo]) => {
    // Adicionar grupo muscular como cabeçalho
    if (currentY > maxY) {
      doc.addPage();
      paginaAtual++;
      currentY = adicionarCabecalho();
    }
    
    doc.setFont("helvetica", "bold");
    doc.text(`${grupo}`, 15, currentY);
    currentY += rowHeight;
    
    // Adicionar exercícios do grupo
    doc.setFont("helvetica", "normal");
    exerciciosGrupo.forEach((exercicio) => {
      if (currentY > maxY) {
        doc.addPage();
        paginaAtual++;
        currentY = adicionarCabecalho();
      }
      
      doc.text(exercicio.nomeExercicio, colStart[0], currentY);
      doc.text(exercicio.diaTreino || "-", colStart[1], currentY);
      doc.text(`${exercicio.cargaIdeal}`, colStart[2], currentY);
      doc.text(`${exercicio.series}`, colStart[3], currentY);
      doc.text(`${exercicio.repeticoes}`, colStart[4], currentY);
      
      currentY += rowHeight;
    });
    
    // Adicionar uma linha em branco entre grupos
    currentY += 2;
  });
  
  // Adicionar rodapé com informações adicionais
  const addFooter = (pageNum: number) => {
    const totalPages = doc.getNumberOfPages();
    doc.setPage(pageNum);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(`Página ${pageNum} de ${totalPages}`, 105, 285, { align: "center" });
    doc.text("Ficha gerada pelo Sistema de Avaliação Física", 105, 290, { align: "center" });
  };
  
  // Adicionar rodapés a todas as páginas
  for (let i = 1; i <= doc.getNumberOfPages(); i++) {
    addFooter(i);
  }
  
  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string): void => {
  doc.save(filename);
};

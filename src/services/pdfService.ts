
import jsPDF from 'jspdf';
import { FichaTreino } from '@/services/alunosService';

export const gerarPDFFichaTreino = (ficha: FichaTreino, alunoNome: string) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Ficha de Treino', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Aluno: ${alunoNome}`, 20, 35);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);
  
  let yPosition = 60;
  
  // Exercícios
  ficha.exercicios.forEach((exercicio, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.text(`${index + 1}. ${exercicio.nomeExercicio}`, 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.text(`Grupo Muscular: ${exercicio.grupoMuscular}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Séries: ${exercicio.series} | Repetições: ${exercicio.repeticoes} | Carga: ${exercicio.cargaIdeal}kg`, 25, yPosition);
    yPosition += 8;
    
    if (exercicio.equipamento) {
      doc.text(`Equipamento: ${exercicio.equipamento}`, 25, yPosition);
      yPosition += 8;
    }
    
    if (exercicio.instrucoes) {
      doc.text(`Instruções: ${exercicio.instrucoes}`, 25, yPosition);
      yPosition += 8;
    }
    
    yPosition += 5;
  });
  
  return doc;
};

export const downloadPDFFichaTreino = (ficha: FichaTreino, alunoNome: string) => {
  const doc = gerarPDFFichaTreino(ficha, alunoNome);
  doc.save(`ficha-treino-${alunoNome.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

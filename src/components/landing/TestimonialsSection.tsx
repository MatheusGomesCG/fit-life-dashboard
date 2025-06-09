
import React from "react";
import { Star } from "lucide-react";

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Marina Silva",
      role: "Personal Trainer",
      initial: "M",
      content: "O FitLife revolucionou minha forma de trabalhar. Consigo acompanhar todos os meus alunos de forma organizada e profissional."
    },
    {
      name: "Roberto Costa",
      role: "Professor de Ed. Física",
      initial: "R",
      content: "Sistema completo e fácil de usar. Meus alunos adoram poder acessar os treinos pelo celular."
    },
    {
      name: "Ana Paula",
      role: "Proprietária de Academia",
      initial: "A",
      content: "Excelente custo-benefício. O suporte é muito atencioso e o sistema é muito estável."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-fitness-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.initial}
                </div>
                <div className="ml-3">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

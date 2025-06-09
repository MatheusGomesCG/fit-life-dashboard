
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock } from "lucide-react";

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: "Iniciante",
      price: "R$ 29",
      students: "25",
      features: [
        "Gestão completa de alunos",
        "Fichas de treino ilimitadas",
        "Acompanhamento de progresso",
        "Suporte por email"
      ],
      buttonStyle: "bg-fitness-primary text-white hover:bg-fitness-primary/90",
      isPopular: false,
      cardStyle: "bg-white"
    },
    {
      name: "Profissional",
      price: "R$ 49",
      students: "50",
      features: [
        "Tudo do plano Iniciante",
        "Relatórios avançados",
        "Backup automático",
        "Suporte prioritário"
      ],
      buttonStyle: "bg-fitness-primary text-white hover:bg-fitness-primary/90",
      isPopular: true,
      cardStyle: "bg-white border-2 border-fitness-primary"
    },
    {
      name: "Empresarial",
      price: "R$ 89",
      students: "100",
      features: [
        "Tudo do plano Profissional",
        "API de integração",
        "Múltiplos professores",
        "Suporte telefônico"
      ],
      buttonStyle: "bg-fitness-primary text-white hover:bg-fitness-primary/90",
      isPopular: false,
      cardStyle: "bg-white"
    },
    {
      name: "Premium",
      price: "R$ 149",
      students: "100+",
      features: [
        "Tudo do plano Empresarial",
        "Alunos ilimitados",
        "Personalização completa",
        "Suporte dedicado"
      ],
      buttonStyle: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90",
      isPopular: false,
      cardStyle: "bg-gradient-to-br from-purple-50 to-blue-50"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Escolha o plano ideal para você
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Planos flexíveis que crescem com o seu negócio. Todos incluem 7 dias de teste gratuito.
          </p>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold inline-block">
            <Clock className="inline h-4 w-4 mr-1" />
            Teste grátis por 7 dias - Sem compromisso
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`${plan.cardStyle} rounded-2xl shadow-lg p-8 relative`}>
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-fitness-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-fitness-primary mb-1">{plan.price}</div>
                <div className="text-gray-500 text-sm mb-6">/mês</div>
                <div className={`${plan.name === 'Premium' ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white' : plan.isPopular ? 'bg-fitness-primary/10' : 'bg-gray-100'} rounded-lg p-3 mb-6`}>
                  <span className={`${plan.name === 'Premium' ? 'text-xl font-bold' : 'text-2xl font-bold'} ${plan.name === 'Premium' ? 'text-white' : plan.isPopular ? 'text-fitness-primary' : 'text-gray-900'}`}>
                    {plan.students}
                  </span>
                  <span className={`block text-sm ${plan.name === 'Premium' ? 'text-white' : 'text-gray-600'}`}>
                    {plan.name === 'Premium' ? 'alunos ilimitados' : 'alunos'}
                  </span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                to="/login?tipo=professor" 
                className={`w-full ${plan.buttonStyle} py-3 rounded-lg font-semibold transition-all flex items-center justify-center`}
              >
                Começar teste grátis
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

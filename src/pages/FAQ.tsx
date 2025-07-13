import React from "react";
import { Header, Footer } from "../components";

const FAQ: React.FC = () => {
  const faqData = [
    {
      question: "Qu'est-ce que Tamkeen ?",
      answer:
        "Tamkeen est une plateforme qui vous aide à identifier et à accéder aux subventions disponibles pour votre projet entrepreneurial au Maroc.",
    },
    {
      question: "Comment fonctionne le test d'éligibilité ?",
      answer:
        "Notre test d'éligibilité analyse vos informations personnelles et les détails de votre projet pour déterminer quelles subventions correspondent le mieux à votre profil.",
    },
    {
      question: "Le service est-il gratuit ?",
      answer:
        "Oui, notre test d'éligibilité est entièrement gratuit. Nous vous aidons à identifier les opportunités de financement sans frais.",
    },
    {
      question: "Combien de temps prend l'évaluation ?",
      answer:
        "L'évaluation initiale est instantanée. Vous recevrez immédiatement une liste des subventions potentiellement adaptées à votre profil.",
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer:
        "Absolument. Nous respectons la loi 09-08 relative à la protection des données personnelles et utilisons des mesures de sécurité avancées pour protéger vos informations.",
    },
    {
      question: "Que se passe-t-il après le test d'éligibilité ?",
      answer:
        "Après le test, vous recevrez une liste personnalisée des subventions adaptées à votre profil, avec les informations nécessaires pour postuler.",
    },
  ];

  return (
    <div className="w-full">
      <Header />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Questions Fréquemment Posées
            </h1>
            <p className="text-xl text-gray-600">
              Trouvez les réponses aux questions les plus courantes sur Tamkeen
            </p>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Vous avez d'autres questions ?
              </h3>
              <p className="text-gray-600 mb-4">
                N'hésitez pas à nous contacter pour plus d'informations
              </p>
              <a
                href="mailto:contact@masubvention.ma"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;

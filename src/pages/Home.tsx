import React from "react";
import { Header, Hero, Footer } from "../components";
import { EligibilityForm } from "../components/eligibility";
import Chatbot from "../components/Chatbot";
import { Helmet } from "react-helmet-async";

const Home: React.FC = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById("eligibility-form");
    if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full">

    <Helmet>
        {/* NOTE: J'ai écrit ce texte pour vous. Vous pouvez aussi le remplacer 
            par vos clés de traduction (ex: t('home.title')) si vous préférez. */}
        
        <title>Tamkeen | Accompagnement, Financement et Subventions</title>
        <meta
          name="description"
          content="Trouvez les subventions et les programmes de financement adaptés à votre entreprise. Testez votre éligibilité et laissez les experts de Tamkeen vous accompagner."
        />

        {/* Balises Open Graph (pour le partage sur les réseaux sociaux) */}
        <meta
          property="og:title"
          content="Tamkeen | Accompagnement, Financement et Subventions"
        />
        <meta
          property="og:description"
          content="Trouvez les subventions et les programmes de financement adaptés à votre entreprise. Testez votre éligibilité et laissez les experts de Tamkeen vous accompagner."
        />
        {/* IMPORTANT : Ajoutez ici l'URL de votre image principale (ex: celle du Hero)
          <meta property="og:image" content="https://votresite.com/image-hero.jpg" /> 
        */}
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />
      <Hero onNavigateToForm={scrollToForm} />
      <div id="eligibility-form">
        <EligibilityForm />
      </div>
      <Footer />

      <Chatbot />
    </div>
  );
};

export default Home;

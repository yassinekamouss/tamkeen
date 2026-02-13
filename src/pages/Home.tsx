import React from "react";
import { Header, Hero, Footer } from "../components";
import { EligibilityForm } from "../components/eligibility";
/*import Chatbot from "../components/Chatbot";*/
import { Helmet } from "react-helmet-async";
import SeoAlternates from "../components/SeoAlternates";

const Home: React.FC = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById("eligibility-form");
    if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full">
      <Helmet>
        {/* Métadonnées alignées avec index.html (MaSubvention) */}
        <title>
          MaSubvention | Tamkeen – Subventions et aides publiques au Maroc
        </title>
        <meta
          name="description"
          content="Plateforme marocaine pour trouver et vérifier votre éligibilité aux subventions et aides publiques. Tamkeen accompagne les entrepreneurs, entreprises et coopératives dans leurs démarches de financement."
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MaSubvention" />
        <meta property="og:url" content="https://masubvention.ma/" />
        <meta
          property="og:title"
          content="MaSubvention | Tamkeen – Subventions et aides publiques au Maroc"
        />
        <meta
          property="og:description"
          content="Plateforme marocaine pour trouver et vérifier votre éligibilité aux subventions et aides publiques. Tamkeen accompagne les entrepreneurs, entreprises et coopératives dans leurs démarches de financement."
        />
        <meta
          property="og:image"
          content="https://masubvention.ma/image_logo.webp"
        />
        <meta property="og:locale" content="fr_FR" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="MaSubvention | Tamkeen – Subventions et aides publiques au Maroc"
        />
        <meta
          name="twitter:description"
          content="Plateforme marocaine pour trouver et vérifier votre éligibilité aux subventions et aides publiques au Maroc."
        />
        <meta
          name="twitter:image"
          content="https://masubvention.ma/image_logo.webp"
        />
      </Helmet>
      <SeoAlternates />

      <Header />
      <Hero onNavigateToForm={scrollToForm} />
      <div id="eligibility-form">
        <EligibilityForm />
      </div>
      <Footer />

    </div>
  );
};

export default Home;

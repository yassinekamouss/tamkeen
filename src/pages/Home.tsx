import React from "react";
import { Header, Hero, EligibilityForm, Footer, Chatbot } from "../components";

const Home: React.FC = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById("eligibility-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">
      <Header />
      <Hero onNavigateToForm={scrollToForm} />
      <EligibilityForm />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Home;

import React, { Suspense, lazy } from "react";
import { Header, Hero, Footer } from "../components";
import LazyOnVisible from "../components/LazyOnVisible";
import Spinner from "../components/Spinner";

// Defer heavy components
const EligibilityForm = lazy(() =>
  import("../components/eligibility").then((m) => ({
    default: m.EligibilityForm,
  }))
);
const Chatbot = lazy(() => import("../components/Chatbot"));

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
      <LazyOnVisible
        placeholder={
          <div className="max-w-4xl mx-auto py-16">
            <Spinner />
          </div>
        }>
        <Suspense fallback={<Spinner />}>
          <EligibilityForm />
        </Suspense>
      </LazyOnVisible>
      <Footer />
      <LazyOnVisible>
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      </LazyOnVisible>
    </div>
  );
};

export default Home;

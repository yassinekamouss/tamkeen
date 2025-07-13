import React, { useState } from "react";
import { Header, Footer, PrivacyModal } from "../components";

const Privacy: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Rediriger vers la page d'accueil
    window.location.href = "/";
  };

  return (
    <div className="w-full">
      <Header />
      <div className="mt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-600 mb-6">
            Consultez notre politique de confidentialité pour comprendre comment
            nous protégeons vos données.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Consulter la politique
          </button>
        </div>
      </div>
      <Footer />

      <PrivacyModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Privacy;

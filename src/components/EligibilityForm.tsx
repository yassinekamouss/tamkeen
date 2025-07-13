import React, { useState } from "react";
import { Link } from "react-router-dom";

interface EligibilityFormProps {
  onNavigateBack?: () => void;
}

interface FormData {
  applicantType: "physique" | "morale" | "";
  // Personne physique
  nom?: string;
  prenom?: string;
  email: string;
  telephone?: string;
  secteurTravail?: string;
  region?: string;
  // Personne morale
  nomEntreprise?: string;
  secteurActivite?: string;
  anneeCreation?: string;
  // Commun
  chiffreAffaire: string;
  montantInvestissement: string;
  acceptPrivacyPolicy: boolean;
}

interface FormErrors {
  applicantType?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  secteurTravail?: string;
  region?: string;
  nomEntreprise?: string;
  secteurActivite?: string;
  anneeCreation?: string;
  chiffreAffaire?: string;
  montantInvestissement?: string;
  acceptPrivacyPolicy?: string;
}

const EligibilityForm: React.FC<EligibilityFormProps> = ({
  onNavigateBack,
}) => {
  const [formData, setFormData] = useState<FormData>({
    applicantType: "",
    email: "",
    chiffreAffaire: "",
    montantInvestissement: "",
    acceptPrivacyPolicy: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const secteursTravail = [
    "Agriculture",
    "Industrie",
    "Services",
    "Commerce",
    "Technologie",
    "Santé",
    "Éducation",
    "Transport",
    "Tourisme",
    "Autre",
  ];

  const regions = [
    "Rabat-Salé-Kénitra",
    "Casablanca-Settat",
    "Marrakech-Safi",
    "Fès-Meknès",
    "Tanger-Tétouan-Al Hoceïma",
    "Oriental",
    "Souss-Massa",
    "Drâa-Tafilalet",
    "Béni Mellal-Khénifra",
    "Laâyoune-Sakia El Hamra",
    "Dakhla-Oued Ed-Dahab",
    "Guelmim-Oued Noun",
  ];

  const chiffreAffaireOptions = [
    { value: "0-1MDH", label: "Entre 0 et 1 MDH" },
    { value: "plus-1MDH", label: "Supérieur à 1 MDH" },
    { value: "sans-ca", label: "Sans chiffre d'affaire en 2025" },
  ];

  const montantInvestissementOptions = [
    { value: "moins-1M", label: "Moins de 1.000.000 DH" },
    { value: "plus-1M", label: "Plus de 1.000.000 DH" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));

    // Clear error when user checks
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.applicantType) {
      newErrors.applicantType = "Veuillez sélectionner le type de demandeur";
    }

    if (!formData.email) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (formData.applicantType === "physique") {
      if (!formData.nom) newErrors.nom = "Le nom est obligatoire";
      if (!formData.prenom) newErrors.prenom = "Le prénom est obligatoire";
      if (!formData.telephone)
        newErrors.telephone = "Le téléphone est obligatoire";
      if (!formData.secteurTravail)
        newErrors.secteurTravail = "Le secteur de travail est obligatoire";
      if (!formData.region) newErrors.region = "La région est obligatoire";
    }

    if (formData.applicantType === "morale") {
      if (!formData.secteurActivite)
        newErrors.secteurActivite = "Le secteur d'activité est obligatoire";
      if (!formData.anneeCreation)
        newErrors.anneeCreation = "L'année de création est obligatoire";
    }

    if (!formData.chiffreAffaire) {
      newErrors.chiffreAffaire = "Le chiffre d'affaire est obligatoire";
    }

    if (!formData.montantInvestissement) {
      newErrors.montantInvestissement =
        "Le montant d'investissement est obligatoire";
    }

    if (!formData.acceptPrivacyPolicy) {
      newErrors.acceptPrivacyPolicy =
        "Vous devez accepter la politique de confidentialité";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      alert("Formulaire soumis avec succès!");
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      <section
        id="eligibility-form"
        className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 sm:py-12 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-blue-800 mb-3 sm:mb-4">
              Test d'Éligibilité
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              Vérifiez votre éligibilité aux subventions Tamkeen
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 max-w-3xl mx-auto">
            {/* Bouton de retour */}
            {onNavigateBack && (
              <button
                onClick={onNavigateBack}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 sm:mb-6 transition-colors">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Retour à l'accueil
              </button>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Type de demandeur - Design Professionnel */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
                  Sélectionnez votre type de demandeur *
                </label>

                {/* Option Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
                  {/* Personne Physique */}
                  <div
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        applicantType: "physique",
                      }))
                    }
                    className={`relative cursor-pointer p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 group ${
                      formData.applicantType === "physique"
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                    }`}>
                    {/* Icône et titre */}
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div
                        className={`p-3 rounded-full transition-colors duration-300 ${
                          formData.applicantType === "physique"
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100 text-blue-500 group-hover:bg-blue-200"
                        }`}>
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3
                          className={`font-semibold text-lg ${
                            formData.applicantType === "physique"
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}>
                          Personne Physique
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Entrepreneur individuel
                        </p>
                      </div>
                    </div>

                    {/* Indicateur de sélection */}
                    {formData.applicantType === "physique" && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Personne Morale */}
                  <div
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        applicantType: "morale",
                      }))
                    }
                    className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 group ${
                      formData.applicantType === "morale"
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                    }`}>
                    {/* Icône et titre */}
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div
                        className={`p-3 rounded-full transition-colors duration-300 ${
                          formData.applicantType === "morale"
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100 text-blue-500 group-hover:bg-blue-200"
                        }`}>
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3
                          className={`font-semibold text-lg ${
                            formData.applicantType === "morale"
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}>
                          Personne Morale
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Entreprise ou Société
                        </p>
                      </div>
                    </div>

                    {/* Indicateur de sélection */}
                    {formData.applicantType === "morale" && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {errors.applicantType && (
                  <p className="text-red-500 text-sm mt-4 text-center font-medium">
                    {errors.applicantType}
                  </p>
                )}
              </div>

              {/* Champs pour Personne Physique */}
              {formData.applicantType === "physique" && (
                <div className="animate-fadeIn space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.nom ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Votre nom"
                      />
                      {errors.nom && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.nom}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.prenom ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Votre prénom"
                      />
                      {errors.prenom && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.prenom}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="votre.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.telephone
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="+212 6 XX XX XX XX"
                      />
                      {errors.telephone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.telephone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secteur de travail *
                      </label>
                      <select
                        name="secteurTravail"
                        value={formData.secteurTravail || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.secteurTravail
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}>
                        <option value="">Sélectionner un secteur</option>
                        {secteursTravail.map((secteur) => (
                          <option key={secteur} value={secteur}>
                            {secteur}
                          </option>
                        ))}
                      </select>
                      {errors.secteurTravail && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.secteurTravail}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Région *
                      </label>
                      <select
                        name="region"
                        value={formData.region || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.region ? "border-red-500" : "border-gray-300"
                        }`}>
                        <option value="">Sélectionner une région</option>
                        {regions.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                      {errors.region && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.region}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Champs pour Personne Morale */}
              {formData.applicantType === "morale" && (
                <div className="animate-fadeIn space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'entreprise
                      </label>
                      <input
                        type="text"
                        name="nomEntreprise"
                        value={formData.nomEntreprise || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Nom de votre entreprise"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="votre.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secteur d'activité *
                      </label>
                      <select
                        name="secteurActivite"
                        value={formData.secteurActivite || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.secteurActivite
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}>
                        <option value="">Sélectionner un secteur</option>
                        {secteursTravail.map((secteur) => (
                          <option key={secteur} value={secteur}>
                            {secteur}
                          </option>
                        ))}
                      </select>
                      {errors.secteurActivite && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.secteurActivite}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Année de création *
                      </label>
                      <input
                        type="number"
                        name="anneeCreation"
                        value={formData.anneeCreation || ""}
                        onChange={handleInputChange}
                        min="1900"
                        max="2025"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.anneeCreation
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="2020"
                      />
                      {errors.anneeCreation && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.anneeCreation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Champs communs */}
              {formData.applicantType && (
                <div className="animate-fadeIn space-y-4 border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chiffre d'affaire *
                      </label>
                      <select
                        name="chiffreAffaire"
                        value={formData.chiffreAffaire}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.chiffreAffaire
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}>
                        <option value="">Sélectionner une option</option>
                        {chiffreAffaireOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.chiffreAffaire && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.chiffreAffaire}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Montant prévisionnel de l'investissement *
                      </label>
                      <select
                        name="montantInvestissement"
                        value={formData.montantInvestissement}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.montantInvestissement
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}>
                        <option value="">Sélectionner une option</option>
                        {montantInvestissementOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.montantInvestissement && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.montantInvestissement}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Politique de confidentialité */}
                  <div className="col-span-1 md:col-span-2 pt-6 border-t border-gray-200">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="acceptPrivacyPolicy"
                        name="acceptPrivacyPolicy"
                        checked={formData.acceptPrivacyPolicy}
                        onChange={handleCheckboxChange}
                        className={`mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border rounded ${
                          errors.acceptPrivacyPolicy
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor="acceptPrivacyPolicy"
                          className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                          J'accepte la{" "}
                          <Link
                            to="/privacy"
                            className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200">
                            politique de confidentialité
                          </Link>{" "}
                          et autorise le traitement de mes données personnelles
                          dans le cadre de l'évaluation de mon éligibilité aux
                          subventions.
                        </label>
                        {errors.acceptPrivacyPolicy && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.acceptPrivacyPolicy}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bouton de soumission */}
                  <div className="col-span-1 md:col-span-2 flex justify-center pt-6">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-lg">
                      Vérifier mon éligibilité
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default EligibilityForm;

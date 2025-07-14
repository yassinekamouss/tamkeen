import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  statutJuridiquePhysique?: string;
  anneeCreation?: string;
  // Personne morale
  nomEntreprise?: string;
  secteurActivite?: string;
  statutJuridiqueMorale?: string;
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
  statutJuridiquePhysique?: string;
  nomEntreprise?: string;
  secteurActivite?: string;
  statutJuridiqueMorale?: string;
  anneeCreation?: string;
  chiffreAffaire?: string;
  montantInvestissement?: string;
  acceptPrivacyPolicy?: string;
}

const EligibilityForm: React.FC<EligibilityFormProps> = ({
  onNavigateBack,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    applicantType: "",
    email: "",
    chiffreAffaire: "",
    montantInvestissement: "",
    acceptPrivacyPolicy: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showResult, setShowResult] = useState(false);
  const [isEligible, setIsEligible] = useState(false);

  const secteursTravail = [
    "EconomieRurale",
    "Industrie",
    "CommerceTraditionnelEcommerce",
    "RechercheInnovation",
    "LogistiqueTransport",
    "SolutionsDigitalesNTIC",
    "ArtisanatActivitesAssimilees",
    "ActivitesEconomiquesArtCulture",
    "IndustriesCreaticesCulturelles",
    "ActivitesEconomiquesSport",
    "ActiviteTouristique",
    "ServicesPersonnes",
    "ServicesEntreprises",
    "EfficaciteEnergetique",
    "PromotionImmobiliere",
    "PecheMaritime",
    "PecheForiere",
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
    { value: "0-1MDH", label: t("eligibility.chiffreAffaireOptions.option1") },
    {
      value: "plus-1MDH",
      label: t("eligibility.chiffreAffaireOptions.option2"),
    },
    { value: "sans-ca", label: t("eligibility.chiffreAffaireOptions.option3") },
  ];

  const montantInvestissementOptions = [
    {
      value: "moins-1M",
      label: t("eligibility.montantInvestissementOptions.option1"),
    },
    {
      value: "plus-1M",
      label: t("eligibility.montantInvestissementOptions.option2"),
    },
  ];

  const statutJuridiquePersonnePhysiqueOptions = [
    {
      value: "personne-physique-patente",
      label: t(
        "eligibility.statutJuridiquePersonnePhysique.personnePhysiquePatente"
      ),
    },
    {
      value: "auto-entrepreneur",
      label: t("eligibility.statutJuridiquePersonnePhysique.autoEntrepreneur"),
    },
    {
      value: "en-cours-creation",
      label: t("eligibility.statutJuridiquePersonnePhysique.enCoursCreation"),
    },
    {
      value: "aucune-forme",
      label: t("eligibility.statutJuridiquePersonnePhysique.aucuneForme"),
    },
  ];

  const statutJuridiquePersonneMoraleOptions = [
    {
      value: "sarl",
      label: t("eligibility.statutJuridiquePersonneMorale.sarl"),
    },
    {
      value: "sarlu",
      label: t("eligibility.statutJuridiquePersonneMorale.sarlu"),
    },
    {
      value: "societe-sas",
      label: t("eligibility.statutJuridiquePersonneMorale.societeSas"),
    },
    {
      value: "aucune-forme-juridique",
      label: t(
        "eligibility.statutJuridiquePersonneMorale.aucuneFormeJuridique"
      ),
    },
    {
      value: "en-cours-creation",
      label: t("eligibility.statutJuridiquePersonneMorale.enCoursCreation"),
    },
  ];

  const anneeCreationOptions = [
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    {
      value: "avant-2022",
      label: t("eligibility.anneeCreationOptions.avant2022"),
    },
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

  const checkEligibility = (data: FormData): boolean => {
    // Critères d'éligibilité (vous pouvez ajuster selon vos besoins)
    // Par exemple : chiffre d'affaires inférieur à 1MDH ET investissement supérieur à 1M
    return (
      data.chiffreAffaire === "0-1MDH" &&
      data.montantInvestissement === "plus-1M"
    );
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.applicantType) {
      newErrors.applicantType = t("eligibility.errors.applicantType");
    }

    if (!formData.email) {
      newErrors.email = t("eligibility.errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("eligibility.errors.emailInvalid");
    }

    if (formData.applicantType === "physique") {
      if (!formData.nom) newErrors.nom = t("eligibility.errors.nomRequired");
      if (!formData.prenom)
        newErrors.prenom = t("eligibility.errors.prenomRequired");
      if (!formData.telephone)
        newErrors.telephone = t("eligibility.errors.telephoneRequired");
      if (!formData.secteurTravail)
        newErrors.secteurTravail = t(
          "eligibility.errors.secteurTravailRequired"
        );
      if (!formData.region)
        newErrors.region = t("eligibility.errors.regionRequired");
      if (!formData.statutJuridiquePhysique)
        newErrors.statutJuridiquePhysique = t(
          "eligibility.errors.statutJuridiqueRequired"
        );
      if (!formData.anneeCreation)
        newErrors.anneeCreation = t("eligibility.errors.anneeCreationRequired");
    }

    if (formData.applicantType === "morale") {
      if (!formData.secteurActivite)
        newErrors.secteurActivite = t(
          "eligibility.errors.secteurActiviteRequired"
        );
      if (!formData.statutJuridiqueMorale)
        newErrors.statutJuridiqueMorale = t(
          "eligibility.errors.statutJuridiqueRequired"
        );
      if (!formData.anneeCreation)
        newErrors.anneeCreation = t("eligibility.errors.anneeCreationRequired");
    }

    if (!formData.chiffreAffaire) {
      newErrors.chiffreAffaire = t("eligibility.errors.chiffreAffaireRequired");
    }

    if (!formData.montantInvestissement) {
      newErrors.montantInvestissement = t(
        "eligibility.errors.montantInvestissementRequired"
      );
    }

    if (!formData.acceptPrivacyPolicy) {
      newErrors.acceptPrivacyPolicy = t(
        "eligibility.errors.acceptPrivacyPolicyRequired"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const eligible = checkEligibility(formData);
      setIsEligible(eligible);
      setShowResult(true);
      console.log("Form submitted:", formData);
    }
  };

  // Composant de résultat d'éligibilité - Design professionnel et minimaliste
  const EligibilityResult = () => (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-lg mx-auto">
        {isEligible ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            {/* Icône de succès */}
            <div className="w-20 h-20 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Titre */}
            <h2 className="text-2xl font-semibold text-green-700 mb-3">
              Éligible
            </h2>

            {/* Message principal */}
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Félicitations ! Votre profil correspond aux critères d'éligibilité
              pour les subventions. Notre équipe d'experts vous contactera sous
              48h pour finaliser votre dossier.
            </p>

            {/* Informations de contact */}
            <div className="bg-gray-50 rounded-xl p-4 mb-8">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                Contact :{" "}
                <span className="font-medium ml-1">{formData.email}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setShowResult(false)}
                className="w-full bg-gray-900 text-white font-medium py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors duration-200">
                Nouveau test
              </button>
              <p className="text-xs text-gray-500">
                Test d'éligibilité - #{Date.now().toString().slice(-6)}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            {/* Icône d'information - Plus visible */}
            <div className="w-20 h-20 mx-auto mb-6 bg-orange-50 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Titre - Plus distinctif */}
            <h2 className="text-2xl font-semibold text-orange-700 mb-3">
              Non éligible
            </h2>

            {/* Message principal - Plus contrasté */}
            <p className="text-gray-700 text-base leading-relaxed mb-6 font-medium">
              D'après vos réponses, vous ne remplissez pas les critères
              d'éligibilité actuels pour les subventions. Cependant, notre
              équipe peut vous orienter vers d'autres solutions de financement
              adaptées à votre situation.
            </p>

            {/* Informations de contact - Style orange */}
            <div className="bg-orange-50 rounded-xl p-4 mb-8 border border-orange-100">
              <div className="flex items-center justify-center text-sm text-orange-700">
                <svg
                  className="w-4 h-4 mr-2 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Pour plus d'informations :{" "}
                <span className="font-semibold ml-1">contact@tamkeen.ma</span>
              </div>
            </div>

            {/* Actions - Bouton orange */}
            <div className="space-y-3">
              <button
                onClick={() => setShowResult(false)}
                className="w-full bg-orange-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-orange-700 transition-colors duration-200">
                Tester à nouveau
              </button>
              <p className="text-xs text-gray-500">
                Test d'éligibilité - #{Date.now().toString().slice(-6)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (showResult) {
    return <EligibilityResult />;
  }

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
        className="min-h-screen py-8 sm:py-12 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-blue-800 mb-3 sm:mb-4">
              {t("eligibility.title")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              {t("eligibility.subtitle")}
            </p>
          </div>

          <div className="p-4 sm:p-8 max-w-5xl mx-auto">
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
                {t("eligibility.backButton")}
              </button>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Type de demandeur - Design Professionnel */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
                  {t("eligibility.applicantType.label")} *
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
                          {t("eligibility.applicantType.physique")}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {t("eligibility.applicantType.physiqueSubtitle")}
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
                          {t("eligibility.applicantType.morale")}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {t("eligibility.applicantType.moraleSubtitle")}
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
                        {t("eligibility.physique.nom")} *
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.nom ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={t("eligibility.physique.nomPlaceholder")}
                      />
                      {errors.nom && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.nom}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("eligibility.physique.prenom")} *
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.prenom ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={t(
                          "eligibility.physique.prenomPlaceholder"
                        )}
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
                        {t("eligibility.email")} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={t("eligibility.emailPlaceholder")}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("eligibility.physique.telephone")} *
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
                        placeholder={t(
                          "eligibility.physique.telephonePlaceholder"
                        )}
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
                        {t("eligibility.physique.secteurTravail")} *
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
                        <option value="">
                          {t("eligibility.selectPlaceholder")}
                        </option>
                        {secteursTravail.map((secteur) => (
                          <option key={secteur} value={secteur}>
                            {t(`eligibility.secteursTravail.${secteur}`)}
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
                        {t("eligibility.physique.region")} *
                      </label>
                      <select
                        name="region"
                        value={formData.region || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.region ? "border-red-500" : "border-gray-300"
                        }`}>
                        <option value="">
                          {t("eligibility.selectPlaceholder")}
                        </option>
                        {regions.map((region) => (
                          <option key={region} value={region}>
                            {t(`eligibility.regions.${region}`)}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("eligibility.physique.statutJuridique")} *
                      </label>
                      <select
                        name="statutJuridiquePhysique"
                        value={formData.statutJuridiquePhysique || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.statutJuridiquePhysique
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}>
                        <option value="">
                          {t("eligibility.selectPlaceholder")}
                        </option>
                        {statutJuridiquePersonnePhysiqueOptions.map(
                          (option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          )
                        )}
                      </select>
                      {errors.statutJuridiquePhysique && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.statutJuridiquePhysique}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("eligibility.anneeCreation")} *
                      </label>
                      <select
                        name="anneeCreation"
                        value={formData.anneeCreation || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.anneeCreation
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}>
                        <option value="">
                          {t("eligibility.selectPlaceholder")}
                        </option>
                        {anneeCreationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.anneeCreation && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.anneeCreation}
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
                        {t("eligibility.morale.nomEntreprise")}
                      </label>
                      <input
                        type="text"
                        name="nomEntreprise"
                        value={formData.nomEntreprise || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder={t(
                          "eligibility.morale.nomEntreprisePlaceholder"
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("eligibility.email")} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={t("eligibility.emailPlaceholder")}
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
                        {t("eligibility.morale.secteurActivite")} *
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
                        <option value="">
                          {t("eligibility.selectPlaceholder")}
                        </option>
                        {secteursTravail.map((secteur) => (
                          <option key={secteur} value={secteur}>
                            {t(`eligibility.secteursTravail.${secteur}`)}
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
                        {t("eligibility.anneeCreation")} *
                      </label>
                      <select
                        name="anneeCreation"
                        value={formData.anneeCreation || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.anneeCreation
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}>
                        <option value="">
                          {t("eligibility.selectPlaceholder")}
                        </option>
                        {anneeCreationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.anneeCreation && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.anneeCreation}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("eligibility.morale.statutJuridique")} *
                      </label>
                      <select
                        name="statutJuridiqueMorale"
                        value={formData.statutJuridiqueMorale || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.statutJuridiqueMorale
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}>
                        <option value="">
                          {t("eligibility.selectPlaceholder")}
                        </option>
                        {statutJuridiquePersonneMoraleOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.statutJuridiqueMorale && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.statutJuridiqueMorale}
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
                        {t("eligibility.chiffreAffaire")} *
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
                        <option value="">
                          {t("eligibility.selectPlaceholder")}
                        </option>
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
                        {t("eligibility.montantInvestissement")} *
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
                        <option value="">
                          {t("eligibility.selectPlaceholder")}
                        </option>
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
                          {t("eligibility.privacyPolicy.text1")}{" "}
                          <Link
                            to="/privacy"
                            className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200">
                            {t("eligibility.privacyPolicy.link")}
                          </Link>{" "}
                          {t("eligibility.privacyPolicy.text2")}
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
                      {t("eligibility.submitButton")}
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

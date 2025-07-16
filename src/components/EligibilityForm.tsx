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
  statutJuridiquePhysique?: string;
  anneeCreation?: string;
  // Personne morale
  nomEntreprise?: string;
  secteurActivite?: string;
  // Commun
  region?: string;
  chiffreAffaire2024?: string;
  chiffreAffaire2023?: string;
  chiffreAffaire2022?: string;
  montantInvestissement: string;
  acceptPrivacyPolicy: boolean;
  statutJuridique: string;
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
  anneeCreation?: string;
  chiffreAffaire2024?: string;
  chiffreAffaire2023?: string;
  chiffreAffaire2022?: string;
  montantInvestissement?: string;
  acceptPrivacyPolicy?: string;
  statutJuridique?: string;
}

const EligibilityForm: React.FC<EligibilityFormProps> = ({
  onNavigateBack,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    applicantType: "",
    email: "",
    montantInvestissement: "",
    acceptPrivacyPolicy: false,
    statutJuridique: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showResult, setShowResult] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibleProgram, setEligibleProgram] = useState<string>("");

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

  const montantInvestissementOptions = [
    {
      value: "moins-1M",
      label: t("eligibility.montantInvestissementOptions.moins1M"),
    },
    {
      value: "1M-50M",
      label: t("eligibility.montantInvestissementOptions.entre1M50M"),
    },
    {
      value: "plus-50M",
      label: t("eligibility.montantInvestissementOptions.plus50M"),
    },
    {
      value: "aucun-minimum",
      label: t("eligibility.montantInvestissementOptions.aucunMinimum"),
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

  // Fonction pour déterminer les années de CA à demander selon l'année de création
  const getYearsForCA = (): number[] => {
    if (!formData.anneeCreation) return [];

    const currentYear = 2025;
    const years = [];

    // Si l'entreprise est créée avant 2022
    if (formData.anneeCreation === "avant-2022") {
      // Demander les 3 dernières années complètes
      years.push(2024, 2023, 2022);
    } else {
      const creationYear = parseInt(formData.anneeCreation);
      // Calculer les années disponibles depuis la création (max 3 années précédentes)
      for (
        let year = currentYear - 1;
        year >= Math.max(creationYear, currentYear - 3);
        year--
      ) {
        years.push(year);
      }
    }

    return years.sort((a, b) => b - a); // Tri décroissant (2024, 2023, 2022)
  };

  const checkEligibility = (
    data: FormData
  ): { isEligible: boolean; program?: string } => {
    // Critères d'éligibilité pour différents programmes

    // 1. Go Siyaha - Vérifier en premier car plus spécialisé
    const secteursTourisme = [
      "ActiviteTouristique",
      "ActivitesEconomiquesArtCulture",
      "IndustriesCreaticesCulturelles",
    ];

    const isGoSiyahaEligible =
      // Secteur d'activité: Tourisme (animation touristique, hébergement innovant, tourisme culturel ou nature)
      (data.secteurTravail && secteursTourisme.includes(data.secteurTravail)) ||
      (data.secteurActivite && secteursTourisme.includes(data.secteurActivite));

    if (isGoSiyahaEligible && data.montantInvestissement) {
      return { isEligible: true, program: "Go Siyaha" };
    }

    // 2. La Charte TPME - Critères plus stricts
    // Forme juridique : Personne morale de droit privé marocaine
    const formeJuridiqueValide = data.applicantType === "morale";

    // Chiffre d'affaires : Entre 1.000.000 MAD et 200.000.000 MAD HT sur une des 3 dernières années
    const years = getYearsForCA();
    let chiffreAffaireValide = false;

    // Si l'entreprise est très récente (pas d'années de CA à vérifier), elle peut être éligible
    if (years.length === 0) {
      chiffreAffaireValide = true;
    } else {
      // Vérifier si au moins une année a un CA entre 1M et 200M MAD
      for (const year of years) {
        const caField = `chiffreAffaire${year}` as keyof FormData;
        const caValue = parseFloat((data[caField] as string) || "0");
        if (caValue >= 1000000 && caValue <= 200000000) {
          chiffreAffaireValide = true;
          break;
        }
      }
    }

    // Montant du projet d'investissement : Entre 1.000.000 MAD et 50.000.000 MAD
    const montantInvestissementValide = data.montantInvestissement === "1M-50M";

    const isCharteTPMEEligible =
      formeJuridiqueValide &&
      chiffreAffaireValide &&
      montantInvestissementValide;

    if (isCharteTPMEEligible) {
      return { isEligible: true, program: "La Charte TPME" };
    }

    return { isEligible: false };
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
      if (!formData.region)
        newErrors.region = t("eligibility.errors.regionRequired");
      if (!formData.statutJuridique)
        newErrors.statutJuridique = t(
          "eligibility.errors.statutJuridiqueRequired"
        );
      if (!formData.anneeCreation)
        newErrors.anneeCreation = t("eligibility.errors.anneeCreationRequired");
    }

    // Validation des chiffres d'affaires selon les années disponibles
    const years = getYearsForCA();
    if (years.length > 0) {
      let hasValidCA = false;
      for (const year of years) {
        const caField = `chiffreAffaire${year}` as keyof FormData;
        const caValue = formData[caField] as string;
        if (caValue && caValue.trim() !== "") {
          const numericValue = parseFloat(caValue);
          if (!isNaN(numericValue) && numericValue >= 0) {
            hasValidCA = true;
          }
        }
      }
      if (!hasValidCA && formData.applicantType === "morale") {
        newErrors.chiffreAffaire2024 =
          "Veuillez renseigner au moins un chiffre d'affaires valide";
      }
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
      const eligibilityResult = checkEligibility(formData);
      setIsEligible(eligibilityResult.isEligible);
      setEligibleProgram(eligibilityResult.program || "");
      setShowResult(true);
      console.log("Form submitted:", formData);
      console.log("Eligibility result:", eligibilityResult);
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
              pour le programme{" "}
              <span className="font-semibold text-blue-600">
                {eligibleProgram}
              </span>
              . Notre équipe d'experts vous contactera sous 48h pour finaliser
              votre dossier.
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
              d'éligibilité actuels. Cependant, notre équipe peut vous orienter
              vers d'autres solutions de financement adaptées à votre situation.
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("eligibility.morale.statutJuridique")} *
                      </label>
                      <select
                        name="statutJuridique"
                        value={formData.statutJuridique || ""}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.statutJuridique
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
                      {errors.statutJuridique && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.statutJuridique}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Champs communs */}
              {formData.applicantType && (
                <div className="animate-fadeIn space-y-4 border-t pt-6">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Chiffres d'affaires dynamiques */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        {t("eligibility.chiffreAffaire")} (en MAD HT) *
                      </label>
                      {getYearsForCA().length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {getYearsForCA().map((year) => (
                            <div key={year}>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Année {year}
                              </label>
                              <input
                                type="number"
                                name={`chiffreAffaire${year}`}
                                value={
                                  (formData[
                                    `chiffreAffaire${year}` as keyof FormData
                                  ] as string) || ""
                                }
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Ex: 1500000"
                                min="0"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-blue-700 text-sm">
                            <svg
                              className="w-4 h-4 inline mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Entreprise récente : Aucun chiffre d'affaires
                            historique requis
                          </p>
                        </div>
                      )}
                      {errors.chiffreAffaire2024 && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.chiffreAffaire2024}
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

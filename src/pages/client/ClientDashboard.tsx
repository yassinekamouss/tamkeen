import React from "react";
import { useNavigate } from "react-router-dom";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { Header, Footer } from "../../components";
import { useTranslation } from "react-i18next";

const ClientDashboard: React.FC = () => {
  const { user, dossiers, tests, logout } = useClientAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const displayName =
    user?.applicantType === "morale"
      ? user?.nomEntreprise || user?.email
      : `${user?.prenom || ""} ${user?.nom || ""}`.trim() || user?.email;

  const activeDossier = dossiers && dossiers.length > 0 ? dossiers[0] : null;

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "AWAITING_INPUTS":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 mr-1.5 ml-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            En attente de vos pièces justificatives
          </span>
        );
      case "AI_DRAFTING":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-2 h-2 mr-1.5 ml-1.5 rounded-full bg-blue-500 animate-spin"></span>
            Génération du dossier par l'IA en cours
          </span>
        );
      case "CONSULTANT_REVIEW":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
            Revue par un consultant expert
          </span>
        );
      case "AWAITING_CLIENT_INFO":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
            Action requise : Compléter le dossier
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
            ✓ Dossier finalisé & livré
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Initialisation du dossier
          </span>
        );
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Welcome & User Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse text-sm font-semibold text-[#1E5ED8]">
              <span>Espace Client CRM V2</span>
              <span>•</span>
              <span className="text-slate-500 font-normal">
                {user?.applicantType === "morale"
                  ? "Personne Morale"
                  : "Personne Physique"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bienvenue <span className="text-[#1E5ED8]">{displayName}</span>, voici votre dossier en cours
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              Suivez en temps réel l'avancement de votre demande de subvention d'investissement.
            </p>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E5ED8] transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2 ml-2 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Dossier Overview Card */}
        {activeDossier ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="font-bold text-slate-900 text-lg">
                  Dossier #{activeDossier.id}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  {activeDossier.plan_type === "PLAN_1"
                    ? "Plan 1 : Génération IA"
                    : "Plan 2 : Accompagnement Consultant"}
                </span>
              </div>
              <div>{getStatusBadge(activeDossier.status)}</div>
            </div>

            {/* Split-Screen Studio Scaffolding Placeholder */}
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form / Document Upload Studio (Prep Phase 2 - Part 2) */}
              <div className="lg:col-span-7 bg-slate-50 rounded-xl p-6 border border-slate-200/80 flex flex-col justify-center items-center text-center space-y-4 min-h-[280px]">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1E5ED8] flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Formulaire d'inputs & Téléversement de pièces
                  </h3>
                  <p className="text-slate-500 text-sm max-w-md mt-1">
                    Cet espace vous permettra d'importer vos documents administratifs et financiers (CIN, Registre de commerce, Bilans...).
                  </p>
                </div>
                <div className="inline-flex items-center text-xs font-semibold text-[#1E5ED8] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  Studio d'édition interactif (Prochaine étape)
                </div>
              </div>

              {/* Right Column: Live Status & Preview (Prep Phase 2 - Part 2) */}
              <div className="lg:col-span-5 bg-slate-50 rounded-xl p-6 border border-slate-200/80 flex flex-col justify-between min-h-[280px]">
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-slate-900 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 ml-2 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Statut de la demande
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-500">Progression :</span>
                      <span className="font-semibold text-slate-800">
                        Étape {activeDossier.current_step_progress} / 5
                      </span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-500">Email client :</span>
                      <span className="font-semibold text-slate-800">
                        {user?.email}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-slate-500">
                        Tests d'éligibilité enregistrés :
                      </span>
                      <span className="font-semibold text-slate-800">
                        {tests ? tests.length : 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 text-center">
                  Tamkeen Center • Human-in-the-Loop CRM Pipeline
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-4">
            <p className="text-slate-600 font-medium">
              Aucun dossier actif n'a encore été créé. Soumettez un test d'éligibilité pour démarrer.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ClientDashboard;

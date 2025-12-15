import React from "react";
import { Building2, User2, Phone, Mail } from "lucide-react";
import type { TestItem } from "../../types/test";

function formatRelativeDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs} h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `il y a ${days} j`;
  return d.toLocaleDateString("fr-MA");
}

function formatAbsoluteDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const date = d.toLocaleDateString("fr-MA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("fr-MA", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} ${time}`;
}

const TestCard: React.FC<{
  test: TestItem;
  index?: number;
  hidePerson?: boolean;
}> = ({ test, index, hidePerson }) => {
  const eligible = (test.programmesEligibles || []).length > 0;

  let montantLabel = "0";
  const mv = test.montantInvestissement;
  if (typeof mv === "string" && mv.trim() !== "") {
    montantLabel = mv;
  } else if (typeof mv === "number" && Number.isFinite(mv)) {
    montantLabel = mv.toLocaleString();
  }

  const dateLabel = formatAbsoluteDate(test.createdAt);

  const isRecent =
    test.createdAt && Date.now() - new Date(test.createdAt).getTime() < 30_000;

  const handleEmailClick = (e: React.MouseEvent, email: string) => {
    e.preventDefault();
    window.location.href = `mailto:${email}`;
  };

  return (
    <div
      className={`bg-white border rounded-lg hover:shadow-sm transition-all duration-200 relative ${
        isRecent ? "border-blue-300 ring-1 ring-blue-100" : "border-slate-200"
      }`}>
      {/* Indicateur wannaBeContacted - Position absolue stabilisée */}
      {test.wannaBeContacted && (
        <div className="absolute -top-2 -right-2 z-10 pointer-events-none">
          <div className="relative w-10 h-10">
            {/* Cercle de pulsation en arrière-plan */}
            <div className="absolute inset-0 w-10 h-10 bg-blue-400 rounded-full opacity-0 animate-[ping_2s_ease-in-out_infinite]"></div>
            
            {/* Badge principal - sans animation pulse */}
            <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Phone className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {typeof index === "number" && (
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                {index + 1}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">
                  Test #{test._id?.slice(-6)}
                </h3>
                {/* Badge de contact inline */}
                {test.wannaBeContacted && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                    <Phone className="w-3 h-3" />
                    Souhaite être contacté
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {formatRelativeDate(test.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isRecent && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">
                Nouveau
              </span>
            )}
            {dateLabel && (
              <span className="text-xs text-slate-600">{dateLabel}</span>
            )}
            {eligible ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                ✓ Éligible
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                ✕ Non éligible
              </span>
            )}
          </div>
        </div>

        {!hidePerson && (
          <div className="mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
              {test.personne?.applicantType === "morale" ? (
                <Building2 className="w-4 h-4 text-slate-600" />
              ) : (
                <User2 className="w-4 h-4 text-slate-600" />
              )}
            </div>
            <div className="text-sm flex-1">
              <div className="text-slate-900 font-medium">
                {test.personne?.applicantType === "morale"
                  ? test.personne?.nomEntreprise
                  : `${test.personne?.nom ?? ""} ${
                      test.personne?.prenom ?? ""
                    }`}
              </div>
              
              <div className="text-slate-500 flex items-center gap-1">
                <button 
                  onClick={(e) => handleEmailClick(e, test.personne?.email || '')}
                  className="hover:text-blue-600 hover:underline transition-colors duration-200 flex items-center gap-1 text-left"
                  title="Envoyer un email"
                >
                  {test.personne?.email}
                  <Mail className="w-3 h-3 opacity-60" />
                </button>
              </div>
            </div>
            {/* Indicateur de contact dans la section personne - animation douce */}
            {test.wannaBeContacted && (
              <div className="flex items-center gap-1 text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full relative">
                  {/* Animation d'opacité au lieu de pulse */}
                  <div className="absolute inset-0 w-2 h-2 bg-blue-500 rounded-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
                <span className="text-xs font-medium">Demande de contact</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-900 border-b border-slate-100 pb-2">
              Informations générales
            </h4>
            <div className="space-y-3">
              <div>
                <dt className="text-xs font-medium text-slate-500 mb-1">
                  Secteur d'activité
                </dt>
                <dd className="text-sm text-slate-900">
                  {test.secteurTravail}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 mb-1">
                  Région
                </dt>
                <dd className="text-sm text-slate-900">{test.region}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 mb-1">
                  Statut juridique
                </dt>
                <dd className="text-sm text-slate-900">
                  {test.statutJuridique || "Non spécifié"}
                </dd>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-900 border-b border-slate-100 pb-2">
              Données financières
            </h4>
            <div className="space-y-3">
              <div>
                <dt className="text-xs font-medium text-slate-500 mb-1">
                  Année de création
                </dt>
                <dd className="text-sm text-slate-900">{test.anneeCreation}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 mb-1">
                  Chiffre d'affaires
                </dt>
                <dd className="text-sm text-slate-900 space-y-1">
                  {test.chiffreAffaires ? (
                    <>
                      {test.chiffreAffaires.chiffreAffaire2022 != null && (
                        <div>
                          2022 : {test.chiffreAffaires.chiffreAffaire2022} MAD
                        </div>
                      )}
                      {test.chiffreAffaires.chiffreAffaire2023 != null && (
                        <div>
                          2023 : {test.chiffreAffaires.chiffreAffaire2023} MAD
                        </div>
                      )}
                      {test.chiffreAffaires.chiffreAffaire2024 != null && (
                        <div>
                          2024 : {test.chiffreAffaires.chiffreAffaire2024} MAD
                        </div>
                      )}
                      {test.chiffreAffaires.chiffreAffaire2022 == null &&
                        test.chiffreAffaires.chiffreAffaire2023 == null &&
                        test.chiffreAffaires.chiffreAffaire2024 == null && (
                        <div>Non spécifié</div>
                      )}
                    </>
                  ) : (
                    <div>Non spécifié</div>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 mb-1">
                  Montant d'investissement
                </dt>
                <dd className="text-sm text-slate-900">{montantLabel}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 mb-1">
                  Nombre d'employés
                </dt>
                <dd className="text-sm text-slate-900">
                  {test.numberOfEmployees || "Non spécifié"}
                </dd>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-900 border-b border-slate-100 pb-2">
              Résultats
            </h4>
            <div>
              <dt className="text-xs font-medium text-slate-500 mb-2">
                Programmes éligibles
              </dt>
              {eligible ? (
                <div className="flex flex-wrap gap-1">
                  {test.programmesEligibles.map((prg, i) => (
                    <dd
                      key={i}
                      className="text-sm text-slate-900 bg-slate-50 px-2 py-1 rounded">
                      {prg}
                    </dd>
                  ))}
                </div>
              ) : (
                <dd className="text-sm text-slate-500 italic">
                  Aucun programme éligible
                </dd>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCard;
import React from "react";
import { Building2, User2 } from "lucide-react";
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
  return `${date} ${time}`; // ex: 11/08/2025 14:32
}

const TestCard: React.FC<{
  test: TestItem;
  index?: number;
  hidePerson?: boolean;
}> = ({ test, index, hidePerson }) => {
  const eligible = (test.programmesEligibles || []).length > 0;

  // Montant d'investissement: montrer tel quel si c'est une chaîne (ex: "1M-50M"), sinon 0 si vide/null
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

  return (
    <div
      className={`bg-white border rounded-lg hover:shadow-sm transition-all duration-200 ${
        isRecent ? "border-blue-300 ring-1 ring-blue-100" : "border-slate-200"
      }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {typeof index === "number" && (
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                {index + 1}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-slate-900">
                Test #{test._id?.slice(-6)}
              </h3>
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
            <div className="text-sm">
              <div className="text-slate-900 font-medium">
                {test.personne?.applicantType === "morale"
                  ? test.personne?.nomEntreprise
                  : `${test.personne?.nom ?? ""} ${
                      test.personne?.prenom ?? ""
                    }`}
              </div>
              <div className="text-slate-500">{test.personne?.email}</div>
            </div>
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

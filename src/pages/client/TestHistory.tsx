import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { ClientHeader } from "../../components";
import { Clock, Plus, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, FileText, Calendar, MapPin, Building2, Briefcase, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const font = {
  display: "font-['Plus_Jakarta_Sans',_sans-serif]",
  body: "font-['Roboto_Flex',_sans-serif]",
  mono: "font-['JetBrains_Mono',_monospace]",
};

const ITEMS_PER_PAGE = 6;

const formatValue = (val: any) => {
  if (val === undefined || val === null || val === "") return "Non renseigné";
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val).replace(/([A-Z])/g, ' $1').trim();
};

const TestHistory: React.FC = () => {
  const { tests, dossiers } = useClientAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [currentPage, setCurrentPage] = useState(1);

  // Tri par date décroissante (les plus récents en premier)
  const sortedTests = [...(tests || [])].sort((a, b) => {
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  const totalPages = Math.ceil(sortedTests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTests = sortedTests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatCurrency = (val: any) => {
    if (!val) return "Non renseigné";
    const strVal = String(val).replace(/\s/g, "");
    if (isNaN(Number(strVal))) return val;
    return strVal.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const getDossierForTest = (testId: number) => {
    return dossiers?.find(d => d.test_id === testId);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#F8F9FA] ${font.body}`} dir={isRTL ? "rtl" : "ltr"}>
      <ClientHeader />

      <main className="flex-grow max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* En-tête de la page */}
        <div className="bg-white rounded border border-[#DADCE0] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 rtl:space-x-reverse text-[11px] font-bold uppercase tracking-[0.05em] text-[#1A73E8]">
              <Clock size={14} />
              <span>Archives et Simulations</span>
            </div>
            <h1 className={`${font.display} text-2xl md:text-3xl font-bold text-[#191C1D] tracking-tight`}>
              Historique des Tests d'Éligibilité
            </h1>
            <p className="text-[#5F6368] text-sm md:text-[15px] max-w-2xl">
              Retrouvez l'intégralité de vos simulations. Vous pouvez consulter les détails déclarés pour chaque test et démarrer un nouveau dossier à partir d'un test concluant.
            </p>
          </div>

          <button
            onClick={() => navigate("/client/test")}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1A73E8] text-white text-sm font-bold rounded-lg hover:bg-[#174EA6] transition-colors shadow-sm shrink-0"
          >
            <Plus size={18} />
            Nouveau Test
          </button>
        </div>

        {/* Liste des tests */}
        {sortedTests.length === 0 ? (
          <div className="bg-white rounded border border-[#DADCE0] p-16 text-center space-y-4 shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#F3F4F5] flex items-center justify-center text-[#727785]">
              <FileText size={32} />
            </div>
            <h3 className={`${font.display} text-xl font-bold text-[#191C1D]`}>Aucun test effectué</h3>
            <p className="text-[#5F6368] font-medium max-w-sm mx-auto">
              Vous n'avez pas encore effectué de simulation d'éligibilité sur notre plateforme.
            </p>
            <button
              onClick={() => navigate("/client/test")}
              className="mt-6 px-6 py-2.5 bg-[#1A73E8] text-white text-sm font-bold rounded-lg hover:bg-[#174EA6] transition-colors inline-block"
            >
              Lancer ma première simulation
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTests.map((test) => {
                const associatedDossier = getDossierForTest(test.id);

                return (
                  <div key={test.id} className="bg-white rounded-xl border border-[#DADCE0] overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
                    {/* Header de la carte */}
                    <div className="border-b border-[#DADCE0] bg-[#F8F9FA] p-5">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`${font.display} font-bold text-[#191C1D] text-lg`}>
                          Test #{test.id}
                        </span>
                        {associatedDossier ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#E8F0FE] text-[#005BBF] text-[10px] font-bold uppercase tracking-wider border border-[#C1C6D6]">
                            <CheckCircle2 size={12} /> Dossier #{associatedDossier.id}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F3F4F5] text-[#5F6368] text-[10px] font-bold uppercase tracking-wider border border-[#DADCE0]">
                            <AlertCircle size={12} /> Test sans dossier
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#5F6368] font-medium">
                        <Calendar size={14} className="text-[#727785]" />
                        {new Date(test.createdAt || Date.now()).toLocaleDateString("fr-FR", {
                          day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </div>
                    </div>

                    {/* Contenu détaillé */}
                    <div className="p-5 flex-grow space-y-4 text-sm">
                      <div className="grid grid-cols-1 gap-y-3">
                        <div className="flex items-start gap-3">
                          <Briefcase size={16} className="text-[#1A73E8] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[11px] font-bold text-[#727785] uppercase tracking-wide">Secteur d'Activité</p>
                            <p className="text-[#191C1D] font-medium">{formatValue(test.secteurTravail)}</p>
                            {test.branche && <p className="text-[#5F6368] text-xs mt-0.5">{formatValue(test.branche)}</p>}
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-[#1A73E8] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[11px] font-bold text-[#727785] uppercase tracking-wide">Région</p>
                            <p className="text-[#191C1D] font-medium">{formatValue(test.region)}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Building2 size={16} className="text-[#1A73E8] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[11px] font-bold text-[#727785] uppercase tracking-wide">Statut Juridique & Création</p>
                            <p className="text-[#191C1D] font-medium">{formatValue(test.statutJuridique)}</p>
                            <p className="text-[#5F6368] text-xs mt-0.5">Création : {formatValue(test.anneeCreation)}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <TrendingUp size={16} className="text-[#1E8E3E] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[11px] font-bold text-[#727785] uppercase tracking-wide">Données Financières</p>
                            <p className="text-[#191C1D] font-medium">Inv. : {formatCurrency(test.montantInvestissement)}</p>
                            {test.chiffreAffaires && Object.keys(test.chiffreAffaires).length > 0 && (
                              <div className="text-xs text-[#5F6368] mt-1 space-y-0.5">
                                {Object.entries(test.chiffreAffaires).map(([year, amount]) => (
                                  <div key={year}>CA {year} : {formatCurrency(amount)} MAD</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer de la carte */}
                    <div className="p-4 border-t border-[#DADCE0] bg-[#F8F9FA] mt-auto">
                      {test.programmesEligibles && test.programmesEligibles.length > 0 ? (
                        <div>
                          <p className="text-[11px] font-bold text-[#1E8E3E] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                            <CheckCircle2 size={14} /> {test.programmesEligibles.length} Programme(s) Éligible(s)
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {test.programmesEligibles.slice(0, 2).map((prog, idx) => (
                              <span key={idx} className="inline-block px-2 py-1 bg-[#E6F4EA] text-[#1E8E3E] text-[10px] font-bold rounded border border-[#A8DAB5] truncate max-w-full">
                                {prog}
                              </span>
                            ))}
                            {test.programmesEligibles.length > 2 && (
                              <span className="inline-block px-2 py-1 bg-[#EDEEEF] text-[#414754] text-[10px] font-bold rounded border border-[#DADCE0]">
                                +{test.programmesEligibles.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] font-bold text-[#93000A] uppercase tracking-wide flex items-center gap-1.5">
                          <AlertCircle size={14} /> Aucun programme identifié
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4 pb-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-[#DADCE0] rounded text-[#414754] hover:bg-[#F8F9FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="text-sm font-medium text-[#5F6368]">
                  Page <strong className="text-[#191C1D]">{currentPage}</strong> sur {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white border border-[#DADCE0] rounded text-[#414754] hover:bg-[#F8F9FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TestHistory;

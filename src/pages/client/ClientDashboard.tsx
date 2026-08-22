import { useState } from 'react';
import { useClientAuth } from '../../contexts/ClientAuthContext';
import { Header, Footer } from "../../components";
import { Navigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const ClientDashboard = () => {
  const { client, tests, loading, logout } = useClientAuth();
  const [searchParams] = useSearchParams();
  const isFirstLogin = searchParams.get('firstLogin') === 'true';
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subventions'>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex items-center justify-center">{t('programs_section.loading')}</div>
        <Footer />
      </div>
    );
  }

  if (!client) {
    return <Navigate to="/login" replace />;
  }

  const latestTest = tests && tests.length > 0 ? tests[0] : null;
  let eligiblePrograms: string[] = [];
  if (latestTest && latestTest.programmesEligibles) {
    try {
      eligiblePrograms = typeof latestTest.programmesEligibles === 'string' 
        ? JSON.parse(latestTest.programmesEligibles) 
        : latestTest.programmesEligibles;
    } catch (e) {
      eligiblePrograms = [];
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {isFirstLogin && eligiblePrograms.length > 0 && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-8 shadow-sm animate-fadeIn">
            <h2 className={`text-xl font-bold text-green-900 mb-3 flex items-center ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <svg className={`w-6 h-6 text-green-600 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('clientDashboard.firstLoginSuccessTitle')}
            </h2>
            <ul className={`list-disc list-inside space-y-2 text-green-800 ${isRTL ? 'mr-8' : 'ml-8'}`}>
              {eligiblePrograms.map((program: string, idx: number) => (
                <li key={idx} className="font-semibold">{program}</li>
              ))}
            </ul>
            <p className="mt-4 text-green-700 text-sm">
              {t('clientDashboard.firstLoginSuccessMsg')}
            </p>
          </div>
        )}

        <div className="mb-6 flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'dashboard' 
                ? 'border-[#1E5ED8] text-[#1E5ED8]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('clientDashboard.tabDashboard')}
          </button>
          <button
            onClick={() => setActiveTab('subventions')}
            className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'subventions' 
                ? 'border-[#1E5ED8] text-[#1E5ED8]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('clientDashboard.tabSubventions')}
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{t('clientDashboard.welcome')} {client.prenom || client.nomEntreprise || t('clientDashboard.client')}</h1>
            <button
              onClick={logout}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E5ED8]"
            >
              {t('clientDashboard.logout')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E4E4E7] rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1E5ED8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t('clientDashboard.accountInfo')}
              </h2>
              <ul className="text-sm text-gray-600 space-y-3">
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="font-semibold text-gray-500">{t('clientDashboard.email')}</span>
                  <span className="text-gray-900" dir="ltr">{client.email}</span>
                </li>
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="font-semibold text-gray-500">{t('clientDashboard.type')}</span>
                  <span className="text-gray-900">{client.applicantType === 'morale' ? t('clientDashboard.entreprise') : t('clientDashboard.personnePhysique')}</span>
                </li>
                {client.applicantType === 'morale' ? (
                  <li className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="font-semibold text-gray-500">{t('clientDashboard.entreprise')}</span>
                    <span className="text-gray-900">{client.nomEntreprise}</span>
                  </li>
                ) : (
                  <li className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="font-semibold text-gray-500">{t('clientDashboard.nomComplet')}</span>
                    <span className="text-gray-900">{client.prenom} {client.nom}</span>
                  </li>
                )}
                <li className="flex justify-between pb-2">
                  <span className="font-semibold text-gray-500">{t('clientDashboard.telephone')}</span>
                  <span className="text-gray-900" dir="ltr">{client.telephones?.[0] || t('clientDashboard.nonRenseigne')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#E4E4E7] rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1E5ED8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('clientDashboard.dossierStatus')}
              </h2>
              {eligiblePrograms.length > 0 ? (
                <div className="mt-2 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                     <p className="text-sm text-gray-700 font-medium mb-2">{t('clientDashboard.latestSubsidy')}</p>
                     <ul className={`list-disc list-inside space-y-1 text-[#1E5ED8] ${isRTL ? 'mr-4' : 'ml-4'}`}>
                        {eligiblePrograms.map((program: string, idx: number) => (
                          <li key={idx} className="font-semibold">{program}</li>
                        ))}
                     </ul>
                  </div>
                  <div className="flex items-center justify-between mt-2 px-1">
                    <span className="text-sm font-medium text-gray-500">{t('clientDashboard.status')}</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${client.etat === 'Terminé' ? 'bg-green-100 text-green-800' :
                        client.etat === 'En traitement' ? 'bg-blue-100 text-[#1E5ED8]' :
                          'bg-amber-100 text-amber-800'
                      }`}>
                      {client.etat}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-2 mb-4">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ${client.etat === 'Terminé' ? 'bg-green-100 text-green-800 border border-green-200' :
                        client.etat === 'En traitement' ? 'bg-blue-100 text-[#1E5ED8] border border-blue-200' :
                          'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                      <span className={`w-2 h-2 rounded-full ${isRTL ? 'ml-2' : 'mr-2'} ${client.etat === 'Terminé' ? 'bg-green-500' :
                          client.etat === 'En traitement' ? 'bg-[#1E5ED8]' :
                            'bg-amber-500 animate-pulse'
                        }`}></span>
                      {client.etat}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed bg-gray-50 p-3 rounded border border-gray-100 mb-4">
                    {t('clientDashboard.dossierStatusDesc')}
                  </p>
                </>
              )}
              
              {eligiblePrograms.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1E5ED8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E5ED8] transition-colors shadow-sm"
                  >
                    {t('clientDashboard.processMyFile')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {activeTab === 'subventions' && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{t('clientDashboard.mySubventions')}</h1>
            </div>
            <div className="space-y-4">
              {(!tests || tests.length === 0) ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-500">{t('clientDashboard.noSubventions')}</p>
                </div>
              ) : (
                tests.map((test, index) => {
                  let progs: string[] = [];
                  try {
                    progs = typeof test.programmesEligibles === 'string' 
                      ? JSON.parse(test.programmesEligibles) 
                      : test.programmesEligibles;
                  } catch(e) {}

                  return (
                    <div key={test.id || index} className="border border-gray-200 rounded-lg p-5 bg-white hover:border-[#1E5ED8] transition-colors shadow-sm">
                      <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                        <span className="text-sm font-medium text-gray-500">
                          {new Date(test.createdAt).toLocaleDateString(i18n.language === 'ar' ? 'ar-MA' : 'fr-FR', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${progs && progs.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {progs && progs.length > 0 ? t('clientDashboard.eligible') : t('clientDashboard.notEligible')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-900">
                        {progs && progs.length > 0 ? (
                          <ul className={`list-disc list-inside space-y-1 ${isRTL ? 'mr-2' : 'ml-2'} text-[#1E5ED8] font-medium`}>
                            {progs.map((p, i) => <li key={i}>{p}</li>)}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">{t('clientDashboard.noPrograms')}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal for Plans */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6" dir={isRTL ? "rtl" : "ltr"}>
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E5ED8]"
                  onClick={() => setIsModalOpen(false)}
                >
                  <span className="sr-only">{t('clientDashboard.close')}</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="sm:flex sm:items-start w-full">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className={`text-lg leading-6 font-medium text-gray-900 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('clientDashboard.processMyFile')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Plan 1 */}
                    <div className={`bg-white border border-[#E4E4E7] rounded-lg p-6 shadow-sm flex flex-col h-full relative overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className={`absolute top-0 ${isRTL ? 'left-0 rounded-br-lg' : 'right-0 rounded-bl-lg'} bg-blue-100 text-[#1E5ED8] text-[10px] font-bold px-3 py-1 uppercase tracking-wider`}>
                        {t('clientDashboard.plan1Badge')}
                      </div>
                      <h3 className="text-lg font-bold text-[#1F2937] mb-3">{t('clientDashboard.plan1Title')}</h3>
                      <p className="text-sm text-[#5B6472] mb-6 flex-grow leading-relaxed">
                        {t('clientDashboard.plan1Desc')}
                      </p>
                      <button
                        disabled
                        className="w-full py-2.5 bg-gray-100 text-gray-400 font-semibold text-sm rounded-md cursor-not-allowed border border-gray-200 transition-colors"
                      >
                        {t('clientDashboard.choosePlanBtn')}
                      </button>
                    </div>

                    {/* Plan 2 */}
                    <div className={`bg-white border-2 border-[#1E5ED8] rounded-lg p-6 shadow-sm flex flex-col h-full relative overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className={`absolute top-0 ${isRTL ? 'left-0 rounded-br-lg' : 'right-0 rounded-bl-lg'} bg-[#1E5ED8] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider`}>
                        {t('clientDashboard.plan2Badge')}
                      </div>
                      <h3 className="text-lg font-bold text-[#1F2937] mb-3">{t('clientDashboard.plan2Title')}</h3>
                      <p className="text-sm text-[#5B6472] mb-6 flex-grow leading-relaxed">
                        {t('clientDashboard.plan2Desc')}
                      </p>
                      <button
                        disabled
                        className="w-full py-2.5 bg-gray-100 text-gray-400 font-semibold text-sm rounded-md cursor-not-allowed border border-gray-200 transition-colors"
                      >
                        {t('clientDashboard.choosePlanBtn')}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ClientDashboard;

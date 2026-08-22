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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Plan 1 */}
            <div className="bg-white border border-[#E4E4E7] rounded-lg p-6 shadow-sm flex flex-col h-full relative overflow-hidden">
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
            <div className="bg-white border-2 border-[#1E5ED8] rounded-lg p-6 shadow-sm flex flex-col h-full relative overflow-hidden">
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
              <p className="text-sm text-gray-500 leading-relaxed bg-gray-50 p-3 rounded border border-gray-100">
                {t('clientDashboard.dossierStatusDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientDashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAuthService } from '../../services/clientAuthService';
import { useClientAuth } from '../../contexts/ClientAuthContext';
import { Header, Footer } from "../../components";
import { useTranslation } from "react-i18next";

const ClientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useClientAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await clientAuthService.login(email, password);
      login(data.clientToken, data.client, data.tests);
      navigate('/dashboard');
    } catch (err: unknown) {
      const e = err as any;
      setError(e.response?.data?.message || t('clientAuth.login.errorDefault'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow border border-gray-200">
          <div>
            <h2 className="mt-2 text-center text-3xl font-bold text-gray-900">
              {t('clientAuth.login.title')}
            </h2>
            <p className="mt-4 text-center text-sm text-gray-600">
              {t('clientAuth.login.subtitle')}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-3 rounded">{error}</div>}
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('clientAuth.login.emailLabel')}</label>
                <input
                  type="email"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1E5ED8] focus:border-[#1E5ED8] sm:text-sm"
                  placeholder={t('clientAuth.login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('clientAuth.login.passwordLabel')}</label>
                <input
                  type="password"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1E5ED8] focus:border-[#1E5ED8] sm:text-sm"
                  placeholder={t('clientAuth.login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1E5ED8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E5ED8]"
              >
                {loading ? t('clientAuth.login.loadingBtn') : t('clientAuth.login.submitBtn')}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientLogin;

import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { clientAuthService } from '../../services/clientAuthService';
import { useClientAuth } from '../../contexts/ClientAuthContext';
import { Header, Footer } from "../../components";

const SetupPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useClientAuth();

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex items-center justify-center">Lien invalide ou manquant.</div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await clientAuthService.setupPassword(token, password);
      login(data.clientToken, data.client);
      navigate('/dashboard');
    } catch (err: unknown) {
      const e = err as any;
      setError(e.response?.data?.message || 'Erreur lors de la configuration du mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow border border-gray-200">
          <div>
            <h2 className="mt-2 text-center text-3xl font-bold text-gray-900">
              Création de votre Espace
            </h2>
            <p className="mt-4 text-center text-sm text-gray-600">
              Veuillez définir un mot de passe pour accéder à votre espace de suivi de dossier.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-3 rounded">{error}</div>}
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                  type="password"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1E5ED8] focus:border-[#1E5ED8] sm:text-sm"
                  placeholder="Nouveau mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                <input
                  type="password"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1E5ED8] focus:border-[#1E5ED8] sm:text-sm"
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1E5ED8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E5ED8]"
              >
                {loading ? 'Création en cours...' : 'Créer mon compte'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SetupPassword;

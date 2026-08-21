import { useClientAuth } from '../../contexts/ClientAuthContext';
import { Header, Footer } from "../../components";
import { Navigate } from 'react-router-dom';

const ClientDashboard = () => {
  const { client, loading, logout } = useClientAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex items-center justify-center">Chargement...</div>
        <Footer />
      </div>
    );
  }

  if (!client) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Header />
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Bienvenue, {client.prenom || client.nomEntreprise || "Client"}</h1>
            <button
              onClick={logout}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E5ED8]"
            >
              Déconnexion
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Informations du compte</h2>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><strong>Email :</strong> {client.email}</li>
                <li><strong>Type :</strong> {client.applicantType === 'morale' ? 'Entreprise' : 'Personne physique'}</li>
                {client.applicantType === 'morale' ? (
                  <li><strong>Entreprise :</strong> {client.nomEntreprise}</li>
                ) : (
                  <li><strong>Nom complet :</strong> {client.prenom} {client.nom}</li>
                )}
                <li><strong>Téléphone :</strong> {client.telephones?.[0] || 'Non renseigné'}</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">État de votre dossier</h2>
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  client.etat === 'Terminé' ? 'bg-green-100 text-green-800' :
                  client.etat === 'En traitement' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {client.etat}
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                L'état de votre dossier est mis à jour par nos consultants au fur et à mesure de son avancement.
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

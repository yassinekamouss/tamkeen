import React from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_FRONT_PREFIX } from "../api/axios";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Accès refusé
          </h1>

          <p className="text-gray-600 mb-8">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page. Contactez un administrateur si vous pensez qu'il s'agit d'une
            erreur.
          </p>

          <button
            onClick={() => navigate(`${ADMIN_FRONT_PREFIX}/dashboard`)}
            className="flex items-center justify-center w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;

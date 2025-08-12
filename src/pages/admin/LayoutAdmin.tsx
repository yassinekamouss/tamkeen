import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { useState } from "react";
import { LayoutDashboard } from "lucide-react";
import logoTamkeen from "../../assets/logo.webp";


const LayoutAdmin = () => {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const adminProfileString = localStorage.getItem("adminProfile");
  const adminProfile = adminProfileString ? JSON.parse(adminProfileString) : null;

  const [showInfo, setShowInfo] = useState(false);


  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      <div
        className={`flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"
          } w-full`}>
        {/* Header professionnel avec logo - FIXE */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              {/* Icône toggle sidebar */}
              <div
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title="Afficher/Masquer le menu">
                <LayoutDashboard
                  size={20}
                  className={`text-gray-600 hover:text-gray-800 transition-transform duration-300 ${sidebarOpen ? "rotate-0" : "rotate-180"
                    }`}
                />
              </div>

              {/* Logo et titre */}
              <div className="flex items-center space-x-3">
                <img
                  src={logoTamkeen}
                  alt="Tamkeen Logo"
                  className="h-8 w-auto"
                />
                <div className="border-l border-gray-300 pl-3">
                  <h1 className="text-lg font-semibold text-gray-800">
                    Espace Administrateur
                  </h1>
                  <p className="text-sm text-gray-500">Plateforme Tamkeen</p>
                </div>
              </div>
            </div>

            {/* Zone utilisateur */}

            <div className="relative">

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {adminProfile ? adminProfile.username : "Administrateur"}
                  </p>
                  <p className="text-xs text-gray-500">{adminProfile ? adminProfile.role : "Rôle"}</p>
                </div>
                {/* Avatar cliquable */}
                <div
                  className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => setShowInfo((prev) => !prev)}
                >
                  <span className="text-sm font-medium text-gray-600">
                    {adminProfile.username.charAt(0).toUpperCase()}
                  </span>
                </div>


              </div>

              {/* Div infos */}
              {showInfo && (
                <div className="absolute top-10 right-0 bg-white shadow-md rounded-lg p-4 w-48 border">
                  <p className="text-sm font-semibold">{adminProfile.username}</p>
                  <p className="text-xs text-gray-500">{adminProfile.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Rôle: {adminProfile.role}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenu principal - avec flex-1 pour prendre toute la hauteur restante */}
        <main className="flex-1 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;

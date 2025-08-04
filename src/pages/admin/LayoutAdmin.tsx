// src/layouts/LayoutAdmin.tsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { useState } from "react";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Menu
} from "lucide-react";

const LayoutAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Fonction pour obtenir l'icône appropriée selon la route
  const getPageIcon = (pathname: string) => {
    if (pathname.includes('/dashboard')) return BarChart3;
    if (pathname.includes('/users')) return Users;
    if (pathname.includes('/programs')) return FileText;
    return BarChart3; // Par défaut
  };

  // Fonction pour obtenir le titre de la page
  const getPageTitle = (pathname: string) => {
    if (pathname.includes('/dashboard')) return 'Tableau de bord';
    if (pathname.includes('/users')) return 'Utilisateurs';
    if (pathname.includes('/programs')) return 'Programmes';
    return 'Administration';
  };

  // Navigation sans refresh et sans ouvrir la sidebar
  const navigateToPage = (path: string) => {
    navigate(path);
    // La sidebar reste dans son état actuel (fermée si elle était fermée)
  };

  const CurrentIcon = getPageIcon(location.pathname);
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Contenu principal */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"} w-full`}>
        {/* Header moderne avec gradient */}
        <header className="bg-gradient-to-r from-white via-blue-50 to-purple-50 border-b border-gray-200/80 backdrop-blur-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Section gauche */}
              <div className="flex items-center space-x-4">
                {/* Toggle sidebar avec animation */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="group p-2.5 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-200"
                  title="Afficher/Masquer le menu"
                >
                  <Menu 
                    size={22} 
                    className="text-gray-600 group-hover:text-blue-600 transition-all duration-200 group-hover:scale-105"
                  />
                </button>

                {/* Titre de page avec icône - visible quand sidebar fermée */}
                {!sidebarOpen && (
                  <div className="flex items-center space-x-3 ml-2">
                    <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
                    <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/50 shadow-sm">
                      <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                        <CurrentIcon size={18} className="text-white" />
                      </div>
                      <span className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        {pageTitle}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Section droite */}
              <div className="flex items-center space-x-3">
                {/* Navigation rapide - visible seulement si sidebar fermée */}
                {!sidebarOpen && (
                  <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-gray-200/70 shadow-sm">
                    <button
                      onClick={() => navigateToPage('/admin/dashboard')}
                      className={`group p-3 rounded-xl transition-all duration-300 ${
                        location.pathname.includes('/dashboard')
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                          : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:scale-105'
                      }`}
                      title="Tableau de bord"
                    >
                      <BarChart3 
                        size={18} 
                        className={`transition-all duration-200 ${
                          location.pathname.includes('/dashboard') ? '' : 'group-hover:scale-110'
                        }`} 
                      />
                    </button>
                    <button
                      onClick={() => navigateToPage('/admin/users')}
                      className={`group p-3 rounded-xl transition-all duration-300 ${
                        location.pathname.includes('/users')
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                          : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:scale-105'
                      }`}
                      title="Utilisateurs"
                    >
                      <Users 
                        size={18} 
                        className={`transition-all duration-200 ${
                          location.pathname.includes('/users') ? '' : 'group-hover:scale-110'
                        }`} 
                      />
                    </button>
                    <button
                      onClick={() => navigateToPage('/admin/programs')}
                      className={`group p-3 rounded-xl transition-all duration-300 ${
                        location.pathname.includes('/programs')
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                          : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:scale-105'
                      }`}
                      title="Programmes"
                    >
                      <FileText 
                        size={18} 
                        className={`transition-all duration-200 ${
                          location.pathname.includes('/programs') ? '' : 'group-hover:scale-110'
                        }`} 
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal avec padding amélioré */}
        <main className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 min-h-[calc(100vh-89px)] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
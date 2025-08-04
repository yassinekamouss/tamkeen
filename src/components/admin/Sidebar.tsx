// src/components/admin/Sidebar.tsx
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  FileText, 
  LogOut, 
  Zap,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const menuItems = [
    {
      to: "/admin/dashboard",
      icon: BarChart3,
      label: "Tableau de bord",
      description: "Vue d'ensemble des données"
    },
    {
      to: "/admin/users",
      icon: Users,
      label: "Utilisateurs",
      description: "Gestion des comptes"
    },
    {
      to: "/admin/programs",
      icon: FileText,
      label: "Programmes",
      description: "Contenu et formations"
    }
  ];

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 text-gray-800 fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out flex flex-col shadow-lg
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"} overflow-hidden`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header avec logo moderne */}
      <div className="p-6 border-b border-gray-100 bg-slate-50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center shadow-sm">
              <Zap size={22} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Admin Panel
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Centre de contrôle</p>
          </div>
        </div>
      </div>

      {/* Navigation épurée */}
      <nav className="flex-1 p-4">
        <div className="mb-6">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4 px-3">
            Navigation
          </p>
        </div>
        
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`group relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-slate-800 text-white shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {/* Indicateur actif simple */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-sm"></div>
                )}
                
                {/* Icône */}
                <div className="flex items-center justify-center w-5 h-5">
                  <IconComponent size={18} />
                </div>

                {/* Contenu du menu */}
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm truncate">{item.label}</p>
                      <p className={`text-xs truncate ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight 
                      size={14} 
                      className={`transition-all duration-200 ${
                        isActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'
                      }`} 
                    />
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer de déconnexion minimaliste */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="group flex items-center w-full px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="p-1 bg-slate-100 group-hover:bg-red-100 rounded-md transition-colors duration-200">
              <LogOut size={16} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">Déconnexion</p>
              <p className="text-xs text-slate-400 group-hover:text-red-400 transition-colors duration-200">
                Quitter la session
              </p>
            </div>
            <ChevronRight size={12} className="opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
          </div>
        </button>
      </div>

   
    </div>
  );
};

export default Sidebar;
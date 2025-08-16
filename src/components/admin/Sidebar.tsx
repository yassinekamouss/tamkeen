// src/components/admin/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Target,
  ClipboardCheck,
  FileText,
  Newspaper,
  LogOut,
  UserCircle,
} from "lucide-react";
import  api from "../../api/axios"; 

const Sidebar = ({
  isOpen,
  testsUnread = 0,
  onResetTestsUnread,
}: {
  isOpen: boolean;
  testsUnread?: number;
  onResetTestsUnread?: () => void;
}) => {
  const navigate = useNavigate();

  const adminProfile = JSON.parse(localStorage.getItem("adminProfile") || "null");
  const isAdministrator = adminProfile?.role === "Administrateur";

 const handleLogout = async () => {
  try {
    await api.post("/admin/logout"); // supprime le cookie côté backend
  } catch (err) {
    console.error("Erreur lors de la déconnexion :", err);
  }

  localStorage.removeItem("adminProfile"); // supprime le profil
  navigate("/admin/login"); // redirige
};

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 text-gray-800 p-5 space-y-6 fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out shadow-sm
        ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        } overflow-hidden`}>
      {/* Logo Section centrer  */}

      <div className="border-b border-gray-200 pb-4 mb-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center">
          Administration
        </h2>
        <p className="text-gray-500 text-sm mt-1">Plateforme Tamkeen</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-1">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`
          }>
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Tableau de bord
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`
          }>
          <Users className="w-5 h-5 mr-3" />
          Candidats
        </NavLink>

        <NavLink
          to="/admin/programs"
          className={({ isActive }) =>
            `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`
          }>
          <Target className="w-5 h-5 mr-3" />
          Programmes
        </NavLink>

        {/* Tests */}
        <NavLink
          to="/admin/tests"
          onClick={() => onResetTestsUnread?.()}
          className={({ isActive }) =>
            `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`
          }>
          <div className="relative mr-3">
            <ClipboardCheck className="w-5 h-5" />
            {testsUnread > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                {testsUnread > 99 ? "99+" : testsUnread}
              </span>
            )}
          </div>
          Tests
        </NavLink>

        {/* News */}
        <NavLink
          to="/admin/news"
          className={({ isActive }) =>
            `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`
          }>
          <Newspaper className="w-5 h-5 mr-3" />
          Actualités
        </NavLink>

        {/* Reports */}
        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`
          }>
          <FileText className="w-5 h-5 mr-3" />
          Rapports
        </NavLink>
      </nav>

      {/* Footer Section */}
      <div className="absolute bottom-5 left-5 right-5">
       {isAdministrator && (
          <NavLink
            to="/admin/app-users"
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`
            }>
            <UserCircle className="w-5 h-5 mr-3" />
            Utilisateurs
          </NavLink>
        )}

        <div className="border-t border-gray-200 pt-4 mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

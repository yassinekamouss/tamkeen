// src/components/admin/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Supprime le token
    navigate("/admin/login"); // Redirige vers la page de login
  };

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 text-gray-800 p-5 space-y-6 fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out shadow-sm
        ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        } overflow-hidden`}>
      {/* Logo Section */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <svg
            className="w-6 h-6 mr-3 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
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
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
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
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          Utilisateurs
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
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Programmes
        </NavLink>

        {/* Tests */}
        <NavLink
          to="/admin/tests"
          className={({ isActive }) =>
            `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`
          }>
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Tests
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
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
              clipRule="evenodd"
            />
          </svg>
          Rapports
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
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h10a3 3 0 003-3V6a3 3 0 00-3-3H4zm3 4h6a1 1 0 010 2H7a1 1 0 010-2zm0 4h6a1 1 0 010 2H7a1 1 0 010-2z" />
          </svg>
          Actualités
        </NavLink>
      </nav>

      {/* Footer Section */}
      <div className="absolute bottom-5 left-5 right-5">
        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <svg
              className="w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

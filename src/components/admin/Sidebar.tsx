// src/components/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");  // Supprime le token
    navigate("/admin/login");                // Redirige vers la page de login
  };
return (
    <div
      className={`h-screen bg-gray-800 text-white p-5 space-y-6 fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"} overflow-hidden`}
    >
      <h2 className="text-2xl font-bold mb-8">Admin</h2>
      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "text-blue-400" : "hover:text-blue-200"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? "text-blue-400" : "hover:text-blue-200"
          }
        >
          Utilisateurs
        </NavLink>
        <NavLink
          to="/admin/programs"
          className={({ isActive }) =>
            isActive ? "text-blue-400" : "hover:text-blue-200"
          }
        >
          Programmes
        </NavLink>

        <button
          onClick={handleLogout}
          className="mt-8 text-left text-red-500 hover:text-red-700"
        >
          Déconnexion
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;

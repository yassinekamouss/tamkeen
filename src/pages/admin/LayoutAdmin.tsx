
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { useState } from "react";
import { LayoutDashboard } from "lucide-react";

const LayoutAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar visible si sidebarOpen est true */}
      <Sidebar isOpen={sidebarOpen} />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"} w-full`}>
        {/* Icône toggle sidebar avec animation */}
        <div
          className="p-4 cursor-ew-resize w-fit"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title="Afficher/Masquer le menu"
        >
          <LayoutDashboard
            size={28}
            className={`text-gray-800 hover:text-black transition-transform duration-1000 ${sidebarOpen ? "rotate-0" : "rotate-180"
              }`}
          />
        </div>

        {/* Contenu principal */}
        <div className="p-6 bg-gray-100 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;

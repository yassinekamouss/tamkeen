import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { useState } from "react";
import { LayoutDashboard } from "lucide-react";
import logoTamkeen from "../../assets/logo.webp";
import axios from "../../api/axios";


const LayoutAdmin = () => {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const adminProfileString = localStorage.getItem("adminProfile");
  const adminProfile = adminProfileString ? JSON.parse(adminProfileString) : null;

  const [showInfo, setShowInfo] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState(adminProfile);


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
              <div className="flex items-center space-x-3 px-4 py-2 bg-white">
                <div className="text-right flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {adminProfile ? adminProfile.username : "Administrateur"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {adminProfile ? adminProfile.role : "Rôle"}
                  </p>
                </div>
                {/* Avatar cliquable */}
                <div
                  className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-200 transition-colors duration-150 border border-gray-300"
                  onClick={() => setShowInfo((prev) => !prev)}
                >
                  <span className="text-sm font-medium text-gray-700">
                    {adminProfile?.username?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
              </div>

              {showInfo && (
                <div className="absolute top-14 right-0 bg-white shadow-lg rounded-lg p-5 w-80 border border-gray-200 z-50">
                  {/* Titre */}
                  <div className="mb-4 pb-3 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profil administrateur
                    </h3>
                  </div>

                  {/* Champs */}
                  <div className="space-y-4">
                    {/* Nom */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nom d'utilisateur</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editMode ? tempProfile.username : adminProfile.username}
                          onChange={(e) => editMode && setTempProfile({ ...tempProfile, username: e.target.value })}
                          disabled={!editMode}
                          className={`w-full p-2.5 border rounded-md text-sm pl-9 ${editMode
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed'}`}
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={editMode ? tempProfile.email : adminProfile.email}
                          onChange={(e) => editMode && setTempProfile({ ...tempProfile, email: e.target.value })}
                          disabled={!editMode}
                          className={`w-full p-2.5 border rounded-md text-sm pl-9 ${editMode
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed'}`}
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                    </div>

                    {/* Rôle */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Rôle</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editMode ? tempProfile.role : adminProfile.role}
                          disabled
                          className="w-full p-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-500 cursor-not-allowed pl-9"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Boutons */}
                    {editMode ? (
                      <div className="flex gap-3 pt-2">
                        <button
                          className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm border border-gray-300"
                          onClick={() => {
                            setEditMode(false);
                            setTempProfile(adminProfile);
                          }}
                        >
                          Annuler
                        </button>
                        <button
                          className="flex-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm"
                          onClick={() => {
                            localStorage.setItem("adminProfile", JSON.stringify(tempProfile));
                            axios.put(`/admin/${adminProfile.id}`, tempProfile)
                              .then(response => console.log("Profil mis à jour :", response.data))
                              .catch(error => console.error("Erreur :", error));
                            setEditMode(false);
                          }}
                        >
                          Enregistrer
                        </button>
                      </div>
                    ) : (
                      <button
                        className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm border border-gray-300 mt-3"
                        onClick={() => {
                          setEditMode(true);
                          setTempProfile(adminProfile);
                        }}
                      >
                        Modifier
                      </button>
                    )}
                  </div>
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

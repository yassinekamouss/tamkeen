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
              <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg px-4 py-2 border border-gray-200 hover:shadow-sm transition-all duration-200">
                <div className="text-right flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {adminProfile ? adminProfile.username : "Administrateur"}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    {adminProfile ? adminProfile.role : "Rôle"}
                  </p>
                </div>

                {/* Avatar cliquable */}
                <div
                  className="h-10 w-10 bg-gradient-to-br from-gray-100 to-gray-120 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ring-2 ring-gray-200"
                  onClick={() => setShowInfo((prev) => !prev)}
                >
                  <span className="text-sm font-bold text-gray-500">
                    {adminProfile?.username?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
              </div>

              {showInfo && (
                <div className="absolute top-14 right-0 bg-white shadow-xl rounded-xl p-6 w-80 border border-gray-100 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="mb-4 pb-4 border-b border-gray-100 ">
                    <h3 className="text-lg flex items-center justify-center font-semibold text-gray-800 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Nom d'utilisateur
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editMode ? tempProfile.username : adminProfile.username}
                          onChange={(e) => editMode && setTempProfile({ ...tempProfile, username: e.target.value })}
                          disabled={!editMode}
                          className={`w-full p-3 border rounded-lg text-sm transition-all duration-200 pl-10 ${editMode
                            ? 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
                            : 'border-gray-100 bg-gray-50 text-gray-700 cursor-not-allowed'
                            }`}
                          placeholder="Nom d'utilisateur"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={editMode ? tempProfile.email : adminProfile.email}
                          onChange={(e) => editMode && setTempProfile({ ...tempProfile, email: e.target.value })}
                          disabled={!editMode}
                          className={`w-full p-3 border rounded-lg text-sm transition-all duration-200 pl-10 ${editMode
                            ? 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
                            : 'border-gray-100 bg-gray-50 text-gray-700 cursor-not-allowed'
                            }`}
                          placeholder="Email"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Rôle
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editMode ? tempProfile.role : adminProfile.role}
                          disabled
                          className="w-full p-3 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed pl-10"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    {editMode ? (
                      <div className="flex gap-3 pt-2">
                        <button
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                          onClick={() => {
                            setEditMode(false);
                            setTempProfile(adminProfile);

                            // Annuler les modifications
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <button
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-400 hover:bg-green-500 text-white rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm"
                          onClick={() => {
                            localStorage.setItem("adminProfile", JSON.stringify(tempProfile));
                            //stock ça dans la base de données 

                            axios.put(`/admin/${adminProfile.id}`, tempProfile)
                              .then(response => {
                                console.log("Profil mis à jour avec succès :", response.data);
                              })
                              .catch(error => {
                                console.error("Erreur lors de la mise à jour du profil :", error);
                              });

                            setEditMode(false);
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-300 hover:bg-gray-500 text-gray-900 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm mt-4"
                        onClick={() => {
                          setEditMode(true);
                          setTempProfile(adminProfile);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
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

import React from "react";
import { useEffect, useState } from "react";
import { Search, Users, Building, User } from 'lucide-react';

const axios = import("axios");

const UsersComponent: React.FC = () => {
  interface Personne {
    _id: string;
    type: "physique" | "morale";
    nom?: string;
    prenom?: string;
    denomination?: string;
    email: string;
    telephone?: string;
  }

  const [personnes, setPersonnes] = useState<Personne[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  useEffect(() => {
    axios.then(({ default: axios }) => {
      axios.get("http://localhost:5000/api/users")
        .then((res) => setPersonnes(res.data))
        .catch((err) => console.error(err));
    });
  }, []);

  const [filtre, setFiltre] = useState("tous");
  const [recherche, setRecherche] = useState("");

  const normaliser = (texte: string | undefined) =>
    texte ? texte.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

  const personnesFiltrees = personnes.filter((personne) => {
    const correspondType = filtre === "tous" || personne.type === filtre;

    const rechercheLower = normaliser(recherche);
    const nom = normaliser(personne.nom);
    const prenom = normaliser(personne.prenom);
    const email = normaliser(personne.email);
    const denomination = normaliser(personne.denomination);

    const correspondRecherche =
      nom.includes(rechercheLower) ||
      prenom.includes(rechercheLower) ||
      email.includes(rechercheLower) ||
      denomination.includes(rechercheLower);

    return correspondType && correspondRecherche;
  });

  const getTypeIcon = (type: "physique" | "morale") => {
    return type === "physique" ? <User className="w-4 h-4" /> : <Building className="w-4 h-4" />;
  };

  const getTypeBadge = (type: "physique" | "morale") => {
    const baseClasses = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium";
    const typeClasses = type === "physique"
      ? "bg-blue-100 text-blue-800 border border-blue-200"
      : "bg-purple-100 text-purple-800 border border-purple-200";

    return `${baseClasses} ${typeClasses}`;
  };



  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = personnesFiltrees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(personnesFiltrees.length / itemsPerPage);


  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec animation */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Liste des utilisateurs
            </h1>
          </div>
        </div>

        {/* Carte principale avec ombre et bordure */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Section des filtres avec design moderne */}
          <div className="bg-gradient-to-r from-gray-200 to-gray-50 px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Filtres par type avec style radio moderne */}
              <div className="flex flex-wrap gap-3">
                <span className="text-black font-medium mb-2 lg:mb-0 mr-4">Filtrer par type :</span>
                {[
                  { value: "tous", label: "Tous", icon: Users },
                  { value: "physique", label: "Physiques", icon: User },
                  { value: "morale", label: "Morales", icon: Building }
                ].map(({ value, label, icon: Icon }) => (
                  <label key={value} className="group cursor-pointer">
                    <input
                      type="radio"
                      value={value}
                      checked={filtre === value}
                      onChange={() => setFiltre(value)}
                      className="sr-only"
                    />
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${filtre === value
                      ? 'bg-white text-gray-800 shadow-md transform scale-105'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`}>
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{label}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Champ de recherche avec icône */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom, email, dénomination..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="block w-full lg:w-96 pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Compteur de résultats */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">{personnesFiltrees.length}</span>
              {personnesFiltrees.length > 1 ? ' utilisateurs trouvés' : ' utilisateur trouvé'}
            </p>
          </div>

          {/* Tableau avec design moderne */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
                <tr>
                  {['Type', 'Nom', 'Prénom', 'Dénomination', 'Email', 'Téléphone'].map((header) => (
                    <th key={header} className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((personne, index) => (
                  <tr
                    key={personne._id}
                    className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getTypeBadge(personne.type)}>
                        {getTypeIcon(personne.type)}
                        {personne.type === "physique" ? "Physique" : "Morale"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${personne.nom ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                        {personne.nom || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${personne.prenom ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                        {personne.prenom || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${personne.denomination ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                        {personne.denomination || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`mailto:${personne.email}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 font-medium"
                      >
                        {personne.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${personne.telephone ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                        {personne.telephone || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination stylée */}
          <div className="flex justify-center items-center gap-4 py-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 
      ${currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-500 hover:text-white shadow-sm"
                }`}
            >
              ←
            </button>

            <span className="text-sm font-semibold text-gray-700">
              Page <span className="text-blue-600">{currentPage}</span> sur <span className="text-gray-800">{totalPages}</span>
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 
      ${currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-500 hover:text-white shadow-sm"
                }`}
            >
              →
            </button>
          </div>


          {/* Message si aucun résultat */}
          {personnesFiltrees.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-500">Essayez de modifier vos critères de recherche ou de filtre.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersComponent;
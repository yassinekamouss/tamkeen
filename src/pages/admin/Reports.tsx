import axios, { ADMIN_API_PREFIX } from "../../api/axios";
import React, { useState, useEffect } from "react";
import type { Admin } from "../../components/admin/admins/types";
import { FileDown } from "lucide-react";

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applicantType, setApplicantType] = useState("all");

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [, setLoading] = useState(true);
  const [consultantAssocie, setConsultantAssocie] = useState<string>("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(`${ADMIN_API_PREFIX}`);
        setAdmins(response.data);
        console.log(response.data);
      } catch {
        setError("Erreur lors du chargement des administrateurs.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Télécharger directement en Excel
  const handleDownload = () => {
    if (!startDate || !endDate) {
      alert("Veuillez choisir une plage de dates");
      return;
    }

    axios
      .get("/users/export", {
        params: {
          startDate,
          endDate,
          applicantType,
          adminId: consultantAssocie, // ✅ ici on envoie le bon paramètre
        },
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Clients.xlsx");
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <div className="p-8 flex flex-col items-center">
      {/* Header */}
      <div className="mb-8 w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <FileDown className="inline-block w-8 h-8 mr-3 text-gray-600" />
          Exporter les candidats
        </h1>
        <p className="text-gray-600">
          Exporter les tests des candidats inscrits sur la plateforme Tamkeen
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 w-full max-w-6xl space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4">
          Options de filtre
        </h2>

        {/* Sélection des dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="border border-gray-300 rounded-lg p-2 w-full bg-gray-50 text-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              min={startDate}
              className="border border-gray-300 rounded-lg p-2 w-full bg-gray-50 text-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
            />
          </div>
        </div>

        {/* Type utilisateur */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Type d’utilisateur
          </label>
          <select
            value={applicantType}
            onChange={(e) => setApplicantType(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full bg-gray-50 text-gray-700 
                   focus:outline-none focus:ring-2 focus:ring-gray-400 transition">
            <option value="all">Tous les types</option>
            <option value="morale">Personne morale</option>
            <option value="physique">Personne physique</option>
          </select>
        </div>

        {/* Sélecteur administrateur */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Consultant associé
          </label>
          <select
            value={consultantAssocie}
            onChange={(e) => setConsultantAssocie(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full bg-gray-50 text-gray-700 
                   focus:outline-none focus:ring-2 focus:ring-gray-400 transition">
            <option value="">Tous les Consultants</option>
            {Array.isArray(admins) &&
              admins.map((admin) => (
                <option key={admin._id} value={admin._id}>
                  {admin.username}
                </option>
              ))}
          </select>
        </div>

        {/* Bouton télécharger */}
        <div className="flex justify-end">
          <button
            onClick={handleDownload}
            className="bg-gray-700 text-white px-6 py-2.5 rounded-lg shadow 
                   hover:bg-gray-800 focus:ring-2 focus:ring-gray-400 transition">
            Télécharger en Excel
          </button>
        </div>

        {/* Message d’erreur si problème */}
        {error && <p className="text-red-600 font-medium">{error}</p>}
      </div>
    </div>
  );
};

export default Reports;

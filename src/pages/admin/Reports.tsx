import axios from "axios";
import React, { useState, useEffect } from "react";
import type { Admin } from "../../components/admin/admins/types";

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userType, setUserType] = useState("all");

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [, setLoading] = useState(true);
  const [selectedAdminId, setSelectedAdminId] = useState<string>("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("/admin"); 
        if (Array.isArray(response.data)) {
          setAdmins(response.data);
        } else {
          console.error("La réponse n'est pas un tableau :", response.data);
        }
      } catch (err) {
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
          userType,
          adminId: selectedAdminId, // ✅ ici on envoie le bon paramètre
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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-lg font-semibold">Exporter les clients</h2>

        {/* Sélection des dates */}
        <div className="flex gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-2 w-full"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Type utilisateur */}
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="all">Tous les types</option>
          <option value="morale">Personne morale</option>
          <option value="physique">Personne physique</option>
        </select>

        {/* Sélecteur administrateur */}
        <select
          value={selectedAdminId}
          onChange={(e) => setSelectedAdminId(e.target.value)}
        >
          <option value="">Choisir un Utilisateur</option>
          {Array.isArray(admins) &&
            admins.map((admin) => (
              <option key={admin._id} value={admin._id}>
                {admin.username}
              </option>
            ))}
        </select>

        {/* Bouton télécharger */}
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Télécharger en Excel
        </button>

        {/* Message d’erreur si problème */}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default Reports;

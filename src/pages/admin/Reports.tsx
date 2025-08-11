import React from "react";

const Reports: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <svg
            className="inline-block w-8 h-8 mr-3 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          Rapports
        </h1>
        <p className="text-gray-600">Téléchargez et exportez des rapports.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500 text-sm">
          Section rapports à venir. Intégration export CSV/PDF et filtres.
        </p>
      </div>
    </div>
  );
};

export default Reports;

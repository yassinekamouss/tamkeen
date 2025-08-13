import React from "react";
import { X } from "lucide-react";
import type { Admin } from "./types";

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAdmin: Admin | null;
  setSelectedAdmin: React.Dispatch<React.SetStateAction<Admin | null>>;
  onSubmit: (e: React.FormEvent) => void;
}

const EditAdminModal: React.FC<EditAdminModalProps> = ({
  isOpen,
  onClose,
  selectedAdmin,
  setSelectedAdmin,
  onSubmit
}) => {
  if (!isOpen || !selectedAdmin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Modifier les informations
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {/* Nom d'utilisateur */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={selectedAdmin.username}
              onChange={(e) =>
                setSelectedAdmin({ ...selectedAdmin, username: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={selectedAdmin.email}
              onChange={(e) =>
                setSelectedAdmin({ ...selectedAdmin, email: e.target.value })
              }
            />
          </div>

          {/* Rôle */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={selectedAdmin.role}
              onChange={(e) =>
                setSelectedAdmin({
                  ...selectedAdmin,
                  role: e.target.value as "Administrateur" | "Consultant"
                })
              }
            >
              <option value="Administrateur">Administrateur</option>
              <option value="Consultant">Consultant</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminModal;

import React, { useEffect, useState } from "react";
import type { User } from "../../../hooks/admin/useUsers";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedUser: User) => Promise<void>;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Modifier les informations
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              placeholder="exemple@domaine.com"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
              value={formData.telephone || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  telephone: e.target.value,
                })
              }
              placeholder="+212 6XXXXXXXX"
            />
          </div>

          {formData.applicantType === "physique" ? (
            <>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                  value={formData.prenom || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prenom: e.target.value,
                    })
                  }
                  placeholder="Prénom"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nom: e.target.value,
                    })
                  }
                  placeholder="Nom"
                />
              </div>
            </>
          ) : (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dénomination
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                value={formData.nomEntreprise || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nomEntreprise: e.target.value,
                  })
                }
                placeholder="Dénomination"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition disabled:opacity-50">
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 transition disabled:opacity-50">
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UserEditModal;

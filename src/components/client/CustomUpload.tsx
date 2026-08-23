import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dossierService } from "../../services/dossierService";
import { useTranslation } from "react-i18next";

interface CustomUploadProps {
  dossierId: number;
}

const CustomUpload: React.FC<CustomUploadProps> = ({ dossierId }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const customUploadMutation = useMutation({
    mutationFn: async () => {
      if (!customLabel.trim()) {
        throw new Error(
          t(
            "clientDashboard.customUpload.errorMissingLabel",
            "Veuillez indiquer un nom ou titre pour ce document."
          )
        );
      }
      if (!selectedFile) {
        throw new Error(
          t(
            "clientDashboard.customUpload.errorMissingFile",
            "Veuillez sélectionner un fichier."
          )
        );
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        throw new Error(
          t(
            "clientDashboard.customUpload.fileTooLarge",
            "La taille du fichier dépasse la limite autorisée (10 Mo)."
          )
        );
      }

      return await dossierService.uploadDocument(
        dossierId,
        selectedFile,
        undefined,
        customLabel.trim()
      );
    },
    onSuccess: () => {
      setErrorMsg(null);
      setSuccessMsg(
        t(
          "clientDashboard.customUpload.success",
          "Document complémentaire ajouté avec succès."
        )
      );
      setCustomLabel("");
      setSelectedFile(null);
      queryClient.invalidateQueries({
        queryKey: ["dossierRequirements", dossierId],
      });
      queryClient.invalidateQueries({
        queryKey: ["dossierRequirements"],
      });
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.message ||
        err.message ||
        t(
          "clientDashboard.customUpload.errorDefault",
          "Erreur lors de l'ajout du document."
        );
      setErrorMsg(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    customUploadMutation.mutate();
  };

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6 transition-all"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/80 transition-colors text-left rtl:text-right"
      >
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E5ED8] flex items-center justify-center font-bold text-lg">
            +
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm block">
              {t(
                "clientDashboard.customUpload.title",
                "Ajouter un document complémentaire non prévu"
              )}
            </span>
            <span className="text-xs text-slate-500 block">
              {t(
                "clientDashboard.customUpload.subtitle",
                "Joignez tout document supplémentaire utile (Ex: Relevé bancaire, Business Plan, etc.)"
              )}
            </span>
          </div>
        </div>

        <svg
          className={`w-5 h-5 text-slate-500 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="p-6 border-t border-slate-100 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
              {successMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t(
                  "clientDashboard.customUpload.labelInput",
                  "Nom / Intitulé du document *"
                )}
              </label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E5ED8] focus:border-transparent outline-none transition-all placeholder-slate-400"
                placeholder={t(
                  "clientDashboard.customUpload.labelPlaceholder",
                  "Ex: Plan de financement, Relevé bancaire..."
                )}
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t(
                  "clientDashboard.customUpload.fileInput",
                  "Fichier joint *"
                )}
              </label>
              <input
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.docx,.doc"
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#1E5ED8] hover:file:bg-blue-100 transition-all cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={customUploadMutation.isPending}
              className="px-5 py-2.5 rounded-xl bg-[#1E5ED8] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50 flex items-center space-x-2 rtl:space-x-reverse"
            >
              {customUploadMutation.isPending && (
                <svg
                  className="animate-spin h-3.5 w-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>
                {customUploadMutation.isPending
                  ? t("clientDashboard.customUpload.submitting", "Ajout en cours...")
                  : t("clientDashboard.customUpload.submitBtn", "Ajouter la pièce")}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CustomUpload;

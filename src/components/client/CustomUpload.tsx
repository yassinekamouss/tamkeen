import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dossierService } from "../../services/dossierService";
import { documentTypeService } from "../../services/documentTypeService";
import { useTranslation } from "react-i18next";

interface CustomUploadProps {
  dossierId: number;
}

const font = {
  display: "font-['Plus_Jakarta_Sans',_sans-serif]",
  body: "font-['Roboto_Flex',_sans-serif]",
};

const CustomUpload: React.FC<CustomUploadProps> = ({ dossierId }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState<number | "">("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data: documentTypes = [], isLoading: isLoadingTypes } = useQuery({
    queryKey: ["activeDocumentTypes"],
    queryFn: documentTypeService.getActiveDocumentTypes,
  });

  const customUploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDocumentTypeId) {
        throw new Error(
          t(
            "clientDashboard.customUpload.errorMissingLabel",
            "Veuillez sélectionner un type de document."
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
        Number(selectedDocumentTypeId)
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
      setSelectedDocumentTypeId("");
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
      className={`bg-white rounded-lg border border-[#DADCE0] overflow-hidden mt-6 ${font.body}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between bg-[#F8F9FA] hover:bg-[#EDEEEF] transition-colors text-left rtl:text-right"
      >
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-7 h-7 rounded bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center font-bold text-base">
            +
          </div>
          <div>
            <span className={`${font.display} font-bold text-[#191C1D] text-sm block`}>
              {t(
                "clientDashboard.customUpload.title",
                "Ajouter un document complémentaire non prévu"
              )}
            </span>
            <span className="text-xs text-[#5F6368] block">
              {t(
                "clientDashboard.customUpload.subtitle",
                "Joignez tout document supplémentaire utile (Ex: Relevé bancaire, Business Plan, etc.)"
              )}
            </span>
          </div>
        </div>

        <svg
          className={`w-5 h-5 text-[#5F6368] transform transition-transform duration-200 ${
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 border-t border-[#DADCE0] space-y-4">
          {errorMsg && (
            <div className="p-3 rounded bg-[#FFDAD6] border-l-4 border-[#BA1A1A] text-[#93000A] text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded bg-[#E6F4EA] border-l-4 border-[#1E8E3E] text-[#1E8E3E] text-xs font-medium">
              {successMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#414754] mb-1.5">
                {t(
                  "clientDashboard.customUpload.labelInput",
                  "Nom / Intitulé du document *"
                )}
              </label>
              <select
                required
                className="w-full px-3.5 py-2.5 bg-white border border-[#DADCE0] rounded text-sm text-[#191C1D] focus:outline-none focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] transition-colors"
                value={selectedDocumentTypeId}
                onChange={(e) => setSelectedDocumentTypeId(e.target.value ? Number(e.target.value) : "")}
                disabled={isLoadingTypes}
              >
                <option value="" disabled>
                  {isLoadingTypes
                    ? t("clientDashboard.customUpload.loadingTypes", "Chargement...")
                    : t("clientDashboard.customUpload.labelPlaceholder", "Sélectionnez un type de document")}
                </option>
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#414754] mb-1.5">
                {t(
                  "clientDashboard.customUpload.fileInput",
                  "Fichier joint *"
                )}
              </label>
              <input
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.docx,.doc"
                className="block w-full text-xs text-[#5F6368] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-[#DADCE0] file:text-xs file:font-semibold file:bg-[#F8F9FA] file:text-[#191C1D] hover:file:bg-[#EDEEEF] cursor-pointer"
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
              className="px-5 py-2.5 rounded bg-[#1A73E8] hover:bg-[#174EA6] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center space-x-2 rtl:space-x-reverse"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
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

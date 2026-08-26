import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dossierService } from "../../services/dossierService";
import type { DocumentRequirement } from "../../types/dossier";
import { useTranslation } from "react-i18next";

interface RequirementListProps {
  dossierId: number;
  requirements: DocumentRequirement[];
}

const font = {
  display: "font-['Plus_Jakarta_Sans',_sans-serif]",
  body: "font-['Roboto_Flex',_sans-serif]",
  mono: "font-['JetBrains_Mono',_monospace]",
};

const RequirementList: React.FC<RequirementListProps> = ({
  dossierId,
  requirements,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const queryClient = useQueryClient();

  const safeRequirements = Array.isArray(requirements) ? requirements : [];

  const [activeReqId, setActiveReqId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    docId: number;
    docName: string;
  } | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      requirementId,
    }: {
      file: File;
      requirementId: number;
    }) => {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(
          t(
            "clientDashboard.upload.fileTooLarge",
            "La taille du fichier dépasse la limite autorisée (10 Mo)."
          )
        );
      }
      return await dossierService.uploadDocument(dossierId, file, requirementId);
    },
    onSuccess: () => {
      setErrorMsg(null);
      setActiveReqId(null);
      queryClient.invalidateQueries({
        queryKey: ["dossierRequirements", dossierId],
      });
      queryClient.invalidateQueries({
        queryKey: ["dossierRequirements"],
      });
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.message ||
        err.message ||
        t(
          "clientDashboard.upload.errorDefault",
          "Erreur lors du téléversement du fichier."
        );
      setErrorMsg(message);
      setActiveReqId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: number) => {
      return await dossierService.deleteDocument(dossierId, documentId);
    },
    onSuccess: () => {
      setErrorMsg(null);
      setDeleteTarget(null);
      queryClient.invalidateQueries({
        queryKey: ["dossierRequirements", dossierId],
      });
      queryClient.invalidateQueries({
        queryKey: ["dossierRequirements"],
      });
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.message ||
        err.message ||
        t(
          "clientDashboard.delete.errorDefault",
          "Erreur lors de la suppression du fichier."
        );
      setErrorMsg(message);
      setDeleteTarget(null);
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    requirementId: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setActiveReqId(requirementId);
      uploadMutation.mutate({ file, requirementId });
    }
  };

  const handleDrop = (e: React.DragEvent, requirementId: number) => {
    e.preventDefault();
    setDragOverId(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setActiveReqId(requirementId);
      uploadMutation.mutate({ file, requirementId });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(2)} MB` : `${Math.round(bytes / 1024)} KB`;
  };

  return (
    <div className={`space-y-4 ${font.body}`} dir={isRTL ? "rtl" : "ltr"}>
      {errorMsg && (
        <div className="p-3.5 rounded bg-[#FFDAD6] border-l-4 border-[#BA1A1A] text-[#93000A] text-xs sm:text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <svg
              className="w-4 h-4 text-[#BA1A1A] flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-[#BA1A1A] hover:text-black transition-colors px-1"
          >
            ✕
          </button>
        </div>
      )}

      <div className="divide-y divide-[#DADCE0] bg-white rounded-lg border border-[#DADCE0] overflow-hidden">
        {safeRequirements.map((req) => {
          const isUploaded = req.status === "UPLOADED";
          const isLoadingThis =
            uploadMutation.isPending && activeReqId === req.id;
          const isDragOver = dragOverId === req.id;
          const docId = req.uploadedDocument?.id || req.uploaded_document_id;

          return (
            <div
              key={req.id}
              className={`p-4 sm:p-5 transition-colors duration-150 ${
                isDragOver ? "bg-[#E8F0FE] border-[#1A73E8]" : "hover:bg-[#F8F9FA]"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverId(req.id);
              }}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(e) => handleDrop(e, req.id)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Info */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                    <span className={`${font.display} font-bold text-[#191C1D] text-sm sm:text-base`}>
                      {req.label}
                    </span>
                    {req.is_required ? (
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#FFDAD6] text-[#93000A]">
                        {t("clientDashboard.requirements.required", "Obligatoire")}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded bg-[#EDEEEF] text-[#414754]">
                        {t("clientDashboard.requirements.optional", "Optionnel")}
                      </span>
                    )}
                  </div>

                  {/* Uploaded details */}
                  {isUploaded && req.uploadedDocument ? (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-[#5F6368] pt-0.5">
                      <svg
                        className="w-4 h-4 text-[#1E8E3E] flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="font-medium text-[#191C1D] truncate max-w-[240px]">
                        {req.uploadedDocument.original_name}
                      </span>
                      <span>•</span>
                      <span className={font.mono}>{formatFileSize(req.uploadedDocument.file_size)}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-[#727785]">
                      {t(
                        "clientDashboard.requirements.dragInstruction",
                        "Glissez-déposez votre fichier ou cliquez pour parcourir (PDF, PNG, JPG, XLSX, DOCX - Max 10 Mo)"
                      )}
                    </p>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex items-center space-x-3 rtl:space-x-reverse flex-shrink-0">
                  {isLoadingThis ? (
                    <div className="inline-flex items-center px-3.5 py-1.5 rounded bg-[#E8F0FE] text-[#005BBF] text-xs font-semibold border border-[#C1C6D6]">
                      <svg
                        className="animate-spin -ml-1 mr-2 ml-2 h-4 w-4 text-[#1A73E8]"
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
                      <span>
                        {t(
                          "clientDashboard.requirements.uploading",
                          "Téléversement..."
                        )}
                      </span>
                    </div>
                  ) : isUploaded ? (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#E6F4EA] text-[#1E8E3E] border border-[#A8DAB5]">
                        <svg
                          className="w-3.5 h-3.5 mr-1 ml-1 text-[#1E8E3E]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {t("clientDashboard.requirements.statusUploaded", "Téléversé")}
                      </span>

                      <label className="cursor-pointer text-xs text-[#1A73E8] hover:text-[#174EA6] font-bold underline px-2 py-1 rounded hover:bg-[#E8F0FE] transition-colors">
                        <span>{t("clientDashboard.requirements.replace", "Remplacer")}</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, req.id)}
                          accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.docx,.doc"
                        />
                      </label>

                      {docId && (
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget({
                              docId,
                              docName: req.uploadedDocument?.original_name || req.label,
                            });
                          }}
                          className="text-xs text-[#BA1A1A] hover:text-[#93000A] font-bold underline px-2 py-1 rounded hover:bg-[#FFDAD6] transition-colors flex items-center space-x-1 rtl:space-x-reverse"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span>{t("clientDashboard.requirements.delete", "Supprimer")}</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <label className="cursor-pointer inline-flex items-center px-3.5 py-2 rounded text-xs font-bold bg-[#1A73E8] hover:bg-[#174EA6] text-white shadow-xs transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#1A73E8]">
                      <svg
                        className="w-4 h-4 mr-1.5 ml-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <span>
                        {t(
                          "clientDashboard.requirements.browseBtn",
                          "Parcourir le fichier"
                        )}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, req.id)}
                        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.docx,.doc"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl p-6 max-w-md w-full border border-[#DADCE0] shadow-xl space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 rounded-full bg-[#FFDAD6] text-[#93000A] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h4 className={`${font.display} text-base font-bold text-[#191C1D]`}>
                Supprimer le document ?
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement le fichier{" "}
              <strong className="text-[#191C1D]">"{deleteTarget.docName}"</strong> ?
            </p>

            <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-xs font-semibold text-[#414754] hover:text-[#191C1D] bg-[#EDEEEF] hover:bg-[#E2E3E5] rounded transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deleteTarget.docId)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#BA1A1A] hover:bg-[#93000A] rounded transition-colors flex items-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <span>Suppression...</span>
                ) : (
                  <span>Oui, supprimer</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementList;

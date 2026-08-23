import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dossierService } from "../../services/dossierService";
import type { DocumentRequirement } from "../../types/dossier";
import { useTranslation } from "react-i18next";

interface RequirementListProps {
  dossierId: number;
  requirements: DocumentRequirement[];
}

const RequirementList: React.FC<RequirementListProps> = ({
  dossierId,
  requirements,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const queryClient = useQueryClient();

  // Type Guard pour garantir que requirements est toujours un tableau
  const safeRequirements = Array.isArray(requirements) ? requirements : [];

  const [activeReqId, setActiveReqId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    docId: number;
    docName: string;
  } | null>(null);

  // Mutation d'upload avec réinitialisation dynamique TanStack Query
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

  // Mutation de suppression définitive (du disque et de la BDD)
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
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <svg
              className="w-5 h-5 text-red-500 flex-shrink-0"
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
            className="text-red-400 hover:text-red-600 transition-colors p-1"
          >
            ✕
          </button>
        </div>
      )}

      <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {safeRequirements.map((req) => {
          const isUploaded = req.status === "UPLOADED";
          const isLoadingThis =
            uploadMutation.isPending && activeReqId === req.id;
          const isDragOver = dragOverId === req.id;
          const docId = req.uploadedDocument?.id || req.uploaded_document_id;

          return (
            <div
              key={req.id}
              className={`p-5 transition-all duration-200 ${
                isDragOver ? "bg-blue-50/70 border-blue-300" : "hover:bg-slate-50/60"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverId(req.id);
              }}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(e) => handleDrop(e, req.id)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Information du Requirement */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                    <span className="font-semibold text-slate-900 text-base">
                      {req.label}
                    </span>
                    {req.is_required ? (
                      <span className="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        {t("clientDashboard.requirements.required", "Obligatoire")}
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {t("clientDashboard.requirements.optional", "Optionnel")}
                      </span>
                    )}
                  </div>

                  {/* Fichier téléversé details */}
                  {isUploaded && req.uploadedDocument ? (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-500 pt-1">
                      <svg
                        className="w-4 h-4 text-emerald-600 flex-shrink-0"
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
                      <span className="font-medium text-slate-700 truncate max-w-[240px]">
                        {req.uploadedDocument.original_name}
                      </span>
                      <span>•</span>
                      <span>{formatFileSize(req.uploadedDocument.file_size)}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      {t(
                        "clientDashboard.requirements.dragInstruction",
                        "Glissez-déposez votre fichier ou cliquez pour parcourir (PDF, PNG, JPG, XLSX, DOCX - Max 10 Mo)"
                      )}
                    </p>
                  )}
                </div>

                {/* Badge d'état & Action Upload / Suppression */}
                <div className="flex items-center space-x-3 rtl:space-x-reverse flex-shrink-0">
                  {isLoadingThis ? (
                    <div className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-50 text-[#1E5ED8] text-xs font-semibold border border-blue-200">
                      <svg
                        className="animate-spin -ml-1 mr-2 ml-2 h-4 w-4 text-[#1E5ED8]"
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
                      <span>
                        {t(
                          "clientDashboard.requirements.uploading",
                          "Téléversement..."
                        )}
                      </span>
                    </div>
                  ) : isUploaded ? (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                        <svg
                          className="w-3.5 h-3.5 mr-1 ml-1 text-emerald-600"
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

                      <label className="cursor-pointer text-xs text-[#1E5ED8] hover:text-blue-700 font-semibold underline px-2 py-1 rounded hover:bg-blue-50 transition-colors">
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
                          className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline px-2 py-1 rounded hover:bg-rose-50 transition-colors flex items-center space-x-1 rtl:space-x-reverse"
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
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-[#1E5ED8] hover:bg-blue-700 text-white shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#1E5ED8]">
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

      {/* Modal de Confirmation de Suppression */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-rose-600"
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
              <h4 className="text-lg font-bold text-slate-900">
                Supprimer le document ?
              </h4>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement le fichier{" "}
              <strong className="text-slate-900">"{deleteTarget.docName}"</strong> ? Le fichier sera immédiatement effacé du serveur et de votre dossier.
            </p>

            <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deleteTarget.docId)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm flex items-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <>
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
                    <span>Suppression...</span>
                  </>
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

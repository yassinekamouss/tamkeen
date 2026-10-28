import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dossierService } from "../../services/dossierService";
import { useTranslation } from "react-i18next";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download,
  FileText,
  RefreshCw,
  FolderOpen,
  Info,
} from "lucide-react";

interface ConsultantRequestedFilesListProps {
  dossierId: number;
  requests: any[];
}

const ConsultantRequestedFilesList: React.FC<ConsultantRequestedFilesListProps> = ({
  dossierId,
  requests,
}) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [uploadingRequestId, setUploadingRequestId] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<{ id: number; message: string } | null>(null);

  const replyMutation = useMutation({
    mutationFn: async ({
      requestId,
      message,
      file,
    }: {
      requestId: number;
      message: string;
      file: File;
    }) => {
      return dossierService.replyToRequest(dossierId, requestId, message, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientRequests", dossierId] });
      setUploadingRequestId(null);
      setUploadError(null);
    },
    onError: (err: any) => {
      setUploadingRequestId(null);
      setUploadError({
        id: uploadingRequestId || 0,
        message: err?.response?.data?.message || "Erreur lors du téléversement du fichier.",
      });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, requestId: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingRequestId(requestId);
      setUploadError(null);
      replyMutation.mutate({
        requestId,
        message: "Document officiel transmis par le client",
        file,
      });
    }
  };

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  if (requests.length === 0) {
    return (
      <div
        className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-white m-6 rounded-lg border border-[#DADCE0] shadow-xs"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-4 text-[#1E8E3E]">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-[#191C1D] mb-1">
          {t("requests.noRequests", "Aucune pièce complémentaire demandée")}
        </h3>
        <p className="text-xs text-[#5F6368] max-w-md leading-relaxed">
          {t(
            "requests.noRequestsDesc",
            "Votre dossier est complet pour cette phase. Si votre consultant a besoin d'une pièce justificative supplémentaire lors de l'instruction, elle apparaîtra directement ici."
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#F8F9FA]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* En-tête informatif */}
        <div className="bg-white p-4 rounded-lg border border-[#DADCE0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <h2 className="text-sm md:text-base font-bold text-[#191C1D] flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-[#1A73E8]" />
              {t("requests.filesRequestedByConsultant", "Bordereau des Pièces Justificatives Demandées")}
            </h2>
            <p className="text-xs text-[#5F6368] mt-0.5">
              Téléversez directement les documents requis pour permettre à votre consultant de finaliser l'instruction.
            </p>
          </div>
          {pendingCount > 0 ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFDBCB] text-[#783100] border border-[#FFB59D] shrink-0 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {pendingCount} pièce(s) en attente
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E6F4EA] text-[#1E8E3E] border border-[#A8DAB5] shrink-0 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Toutes les pièces sont transmises
            </span>
          )}
        </div>

        {/* Liste des fiches documentaires */}
        {requests.map((req) => {
          const isPending = req.status === "PENDING";
          const documentTitle = req.documentType?.name || req.message;
          // La consigne est présente si req.message apporte une précision distincte du nom du document
          const customInstructionText = (req.message && req.documentType?.name && req.message.trim().toLowerCase() !== req.documentType.name.trim().toLowerCase())
            ? req.message.trim()
            : (!req.documentType?.name && req.message ? req.message.trim() : null);
          const hasCustomInstruction = Boolean(customInstructionText);
          const attachmentMsg = req.messages?.slice().reverse().find((m: any) => m.attachment_url);
          const isCurrentUploading = uploadingRequestId === req.id;
          const currentError = (uploadError && uploadError.id === req.id) ? uploadError.message : null;

          return (
            <div
              key={req.id}
              className={`bg-white rounded-lg border transition-all p-5 shadow-xs ${
                isPending ? "border-[#FFB59D]/70 bg-white ring-1 ring-amber-100" : "border-[#DADCE0] bg-white"
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Infos du document */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {req.importance === "OBLIGATOIRE" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-200">
                        {t("requests.mandatory", "Obligatoire")}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-600 border border-gray-200">
                        {t("requests.optional", "Complémentaire")}
                      </span>
                    )}

                    {isPending ? (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FFDBCB] text-[#783100] border border-[#FFB59D] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {t("requests.pending", "En attente de transmission")}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#E6F4EA] text-[#1E8E3E] border border-[#A8DAB5] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {t("requests.provided", "Transmis & Enregistré")}
                      </span>
                    )}

                    <span className="text-[11px] text-[#5F6368]">
                      Ref #{req.id} • {t("requests.requestedOn", { date: new Date(req.createdAt).toLocaleDateString(isRTL ? "ar-MA" : "fr-FR"), defaultValue: `Demandé le ${new Date(req.createdAt).toLocaleDateString()}` })}
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-[#191C1D] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1A73E8] shrink-0" />
                    <span>{documentTitle}</span>
                  </h3>

                  {hasCustomInstruction && (
                    <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs">
                      <Info className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-amber-900 block mb-0.5">Motif / Consigne de l'expert :</span>
                        <span className="text-amber-900/90 leading-relaxed">{customInstructionText}</span>
                      </div>
                    </div>
                  )}

                  {currentError && (
                    <p className="text-xs text-red-600 font-medium">{currentError}</p>
                  )}
                </div>

                {/* Zone d'action directe (Import / Consultation / Remplacement) */}
                <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  {isPending ? (
                    <div>
                      <input
                        type="file"
                        id={`file-upload-${req.id}`}
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xlsx"
                        onChange={(e) => handleFileUpload(e, req.id)}
                        disabled={isCurrentUploading}
                      />
                      <label
                        htmlFor={`file-upload-${req.id}`}
                        className={`flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#174EA6] rounded-md cursor-pointer transition-colors shadow-xs ${
                          isCurrentUploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isCurrentUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{t("requests.sending", "Transmission en cours...")}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>{t("requests.attachFile", "Importer le document requis")}</span>
                          </>
                        )}
                      </label>
                      <p className="text-[10px] text-[#727785] text-center mt-1">PDF, JPG, PNG (max 20 Mo)</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {attachmentMsg && (
                        <a
                          href={`${import.meta.env.VITE_PREFIX_URL || "http://localhost:5000/uploads"}/dossiers/${dossierId}/${attachmentMsg.attachment_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1A73E8] bg-[#E8F0FE] hover:bg-[#D2E3FC] border border-[#C1C6D6] rounded-md transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{t("requests.consult", "Consulter la pièce")}</span>
                        </a>
                      )}

                      {/* Possibilité de remplacer le document si nécessaire */}
                      <div>
                        <input
                          type="file"
                          id={`file-replace-${req.id}`}
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xlsx"
                          onChange={(e) => handleFileUpload(e, req.id)}
                          disabled={isCurrentUploading}
                        />
                        <label
                          htmlFor={`file-replace-${req.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#414754] bg-[#F8F9FA] hover:bg-[#EDEEEF] border border-[#DADCE0] rounded-md cursor-pointer transition-colors"
                          title="Remplacer par une version plus récente"
                        >
                          {isCurrentUploading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                          )}
                          <span>Remplacer</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConsultantRequestedFilesList;

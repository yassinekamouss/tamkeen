import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dossierService } from "../../services/dossierService";
import { Upload, CheckCircle2, AlertCircle, Loader2, Download } from "lucide-react";

interface ConsultantRequestedFilesListProps {
  dossierId: number;
  requests: any[];
}

const ConsultantRequestedFilesList: React.FC<ConsultantRequestedFilesListProps> = ({ dossierId, requests }) => {
  const queryClient = useQueryClient();
  const [uploadingRequestId, setUploadingRequestId] = useState<number | null>(null);

  const replyMutation = useMutation({
    mutationFn: async ({ requestId, message, file }: { requestId: number; message: string; file: File }) => {
      return dossierService.replyToRequest(dossierId, requestId, message, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientRequests", dossierId] });
      setUploadingRequestId(null);
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, requestId: number) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingRequestId(requestId);
      replyMutation.mutate({
        requestId,
        message: "Fichier joint",
        file: e.target.files[0]
      });
    }
  };

  if (requests.length === 0) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-white m-6 rounded border border-[#DADCE0] shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#E8F0FE] flex items-center justify-center mb-4">
          <CheckCircle2 className="w-6 h-6 text-[#1A73E8]" />
        </div>
        <h3 className="text-lg font-bold text-[#191C1D] mb-2">Aucun document requis</h3>
        <p className="text-sm text-[#5F6368] max-w-sm">
          Votre consultant n'a demandé aucun document pour le moment. Vous serez notifié en cas de nouvelle demande.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-[#191C1D] mb-6 flex items-center gap-2">
          Fichiers demandés par le consultant
        </h2>

        {requests.map((req) => (
          <div key={req.id} className="bg-white rounded-lg border border-[#DADCE0] shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {req.importance === "OBLIGATOIRE" ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-200">
                    Obligatoire
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-600 border border-gray-200">
                    Facultatif
                  </span>
                )}

                {req.status === "PENDING" ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    En attente
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Fourni
                  </span>
                )}
              </div>
              <h4 className="text-[15px] font-bold text-[#191C1D] leading-snug">
                {req.input_type === "FILE" && req.documentType?.name ? req.documentType.name : req.message}
              </h4>
              <p className="text-xs text-[#5F6368] mt-1">
                Demandé le {new Date(req.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="w-full sm:w-auto shrink-0">
              {req.status === "PENDING" && (
                <div className="relative">
                  <input
                    type="file"
                    id={`file-upload-${req.id}`}
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, req.id)}
                    disabled={uploadingRequestId === req.id}
                  />
                  <label
                    htmlFor={`file-upload-${req.id}`}
                    className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#1A73E8] hover:bg-[#174EA6] rounded-md cursor-pointer transition-colors ${uploadingRequestId === req.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {uploadingRequestId === req.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploadingRequestId === req.id ? "Envoi..." : "Joindre le fichier"}
                  </label>
                </div>
              )}
              {req.status !== "PENDING" && (
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 rounded-md whitespace-nowrap">
                    <CheckCircle2 className="w-4 h-4" />
                    Transmis
                  </div>

                  {(() => {
                    const attachmentMsg = req.messages?.slice().reverse().find((m: any) => m.attachment_url);
                    if (attachmentMsg) {
                      return (
                        <a
                          href={`${import.meta.env.VITE_PREFIX_URL || "http://localhost:5000/uploads"}/dossiers/${dossierId}/${attachmentMsg.attachment_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#1A73E8] bg-[#F8F9FA] hover:bg-[#F3F4F5] border border-[#DADCE0] rounded-md transition-colors whitespace-nowrap"
                        >
                          <Download className="w-4 h-4" />
                          Consulter
                        </a>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultantRequestedFilesList;

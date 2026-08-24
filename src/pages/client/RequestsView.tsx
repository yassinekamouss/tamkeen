import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dossierService } from "../../services/dossierService";

interface RequestMessage {
  id: number;
  sender_type: "CLIENT" | "CONSULTANT";
  message: string | null;
  attachment_url: string | null;
  createdAt: string;
}

interface DossierRequest {
  id: number;
  dossier_id: number;
  creator_type: "CLIENT" | "CONSULTANT";
  input_type: "FILE" | "TEXT";
  message: string;
  status: "PENDING" | "FULFILLED" | "RESOLVED";
  createdAt: string;
  messages: RequestMessage[];
}

interface RequestsViewProps {
  dossierId: number;
  planType: string;
}

const RequestsView: React.FC<RequestsViewProps> = ({ dossierId, planType }) => {
  const queryClient = useQueryClient();
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyFile, setReplyFile] = useState<File | null>(null);

  // Vérification Plan 1 vs Plan 2
  if (planType !== "PLAN_2") {
    return (
      <div className="p-8 md:p-12 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Messagerie réservée au Plan 2
          </h2>
          <p className="text-slate-600 text-sm">
            Vous avez choisi le Plan 1 (Génération IA). L'échange direct avec nos experts-consultants est exclusif au Plan 2.
          </p>
        </div>
        <button className="px-6 py-3 bg-[#1E5ED8] text-white text-sm font-bold rounded-xl shadow hover:bg-blue-700 transition">
          Passer au Plan 2
        </button>
      </div>
    );
  }

  // Requêtes (Plan 2)
  const { data: requests = [], isLoading } = useQuery<DossierRequest[]>({
    queryKey: ["clientRequests", dossierId],
    queryFn: async () => {
      const res = await dossierService.getRequests(dossierId);
      return res.data;
    },
    enabled: !!dossierId,
  });

  const createRequestMutation = useMutation({
    mutationFn: async (message: string) => {
      return dossierService.createClientRequest(dossierId, message);
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["clientRequests", dossierId] });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ requestId, message, file }: { requestId: number; message: string; file: File | null }) => {
      return dossierService.replyToRequest(dossierId, requestId, message, file);
    },
    onSuccess: () => {
      setReplyMessage("");
      setReplyFile(null);
      queryClient.invalidateQueries({ queryKey: ["clientRequests", dossierId] });
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Chargement de la messagerie...</div>;
  }

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      createRequestMutation.mutate(newMessage);
    }
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRequestId && (replyMessage.trim() || replyFile)) {
      replyMutation.mutate({ requestId: selectedRequestId, message: replyMessage, file: replyFile });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[600px] bg-white">
      {/* Sidebar: Liste des requêtes */}
      <div className="w-full md:w-1/3 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Vos Demandes</h3>
          {/* Nouveau message direct */}
          <form onSubmit={handleCreateRequest} className="space-y-2">
            <textarea
              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-[#1E5ED8] focus:border-[#1E5ED8] resize-none"
              rows={2}
              placeholder="Nouvelle question pour l'expert..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || createRequestMutation.isPending}
              className="w-full bg-[#1E5ED8] hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              Envoyer
            </button>
          </form>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {requests.length === 0 ? (
            <p className="text-center text-slate-500 text-sm mt-4">Aucune demande.</p>
          ) : (
            requests.map((req) => (
              <button
                key={req.id}
                onClick={() => setSelectedRequestId(req.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  selectedRequestId === req.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-semibold text-slate-700">
                    {req.creator_type === "CONSULTANT" ? "Expert" : "Vous"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-900 truncate">{req.message}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    req.status === "PENDING" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {req.status === "PENDING" ? "En attente" : "Résolu"}
                  </span>
                  {req.input_type === "FILE" && (
                    <span className="text-[10px] text-slate-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      Fichier demandé
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content: Fil de discussion */}
      <div className="w-full md:w-2/3 flex flex-col bg-slate-50">
        {selectedRequest ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-white">
              <h4 className="font-bold text-slate-900">Détail de la demande</h4>
              <p className="text-sm text-slate-600 mt-1">{selectedRequest.message}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedRequest.messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender_type === "CLIENT" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.sender_type === "CLIENT" ? "bg-[#1E5ED8] text-white rounded-br-none" : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                  }`}>
                    {msg.message && <p className="text-sm">{msg.message}</p>}
                    {msg.attachment_url && (
                      <div className={`mt-2 flex items-center text-xs ${msg.sender_type === "CLIENT" ? "text-blue-100" : "text-blue-600"}`}>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Fichier joint
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Formulaire de réponse */}
            {selectedRequest.status === "PENDING" && (
              <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleReply} className="flex flex-col gap-3">
                  <textarea
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-[#1E5ED8] focus:border-[#1E5ED8] resize-none"
                    rows={2}
                    placeholder="Écrivez votre réponse..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    {selectedRequest.input_type === "FILE" && selectedRequest.creator_type === "CONSULTANT" ? (
                      <input
                        type="file"
                        onChange={(e) => setReplyFile(e.target.files?.[0] || null)}
                        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    ) : (
                      <div />
                    )}
                    <button
                      type="submit"
                      disabled={replyMutation.isPending || (!replyMessage.trim() && !replyFile)}
                      className="px-6 py-2 bg-[#1E5ED8] hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50"
                    >
                      Répondre
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Sélectionnez une demande pour voir la conversation.
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsView;

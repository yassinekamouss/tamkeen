import React from "react";
import {
    Plus,
    MessageSquare,
    Send,
    Loader2,
    CheckCircle2,
    FolderOpen,
    FileText,
    Download,
    Paperclip,
} from "lucide-react";

interface StudioRequestsTabProps {
    dossier: any;
    dossierId: number;
    selectedRequestId: number | null;
    setSelectedRequestId: (id: number | null) => void;
    requestMessage: string;
    setRequestMessage: (msg: string) => void;
    requestError: string | null;
    handleCreateRequest: (e: React.FormEvent) => void;
    createRequestPending: boolean;
    resolveMutation: any;
    replyMutation: any;
    returnToClientMutation: any;
    replyMessage: string;
    setReplyMessage: (msg: string) => void;
    replyFile: File | null;
    setReplyFile: (file: File | null) => void;
    handleReplySubmit: (e: React.FormEvent, reqId: number) => void;
    onGoToDocs: () => void;
}

export const StudioRequestsTab: React.FC<StudioRequestsTabProps> = ({
    dossier,
    dossierId,
    selectedRequestId,
    setSelectedRequestId,
    requestMessage,
    setRequestMessage,
    requestError,
    handleCreateRequest,
    createRequestPending,
    resolveMutation,
    replyMutation,
    returnToClientMutation,
    replyMessage,
    setReplyMessage,
    replyFile,
    setReplyFile,
    handleReplySubmit,
    onGoToDocs,
}) => {
    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 flex space-x-4">
                {/* LISTE DES MESSAGES / ÉCHANGES (SIDEBAR) */}
                <div className="w-1/3 flex flex-col border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Échanges & Questions</h4>
                        <button
                            onClick={() => setSelectedRequestId(null)}
                            className="p-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                            title="Nouvelle question / message"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {dossier.dossierRequests?.filter((r: any) => r.input_type !== "FILE").length === 0 && (
                            <p className="text-[10px] text-gray-500 text-center mt-4">Aucune correspondance en cours.</p>
                        )}
                        {dossier.dossierRequests?.filter((r: any) => r.input_type !== "FILE").map((req: any) => (
                            <button
                                key={req.id}
                                onClick={() => setSelectedRequestId(req.id)}
                                className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border cursor-pointer ${
                                    selectedRequestId === req.id
                                        ? "bg-slate-50 border-slate-200 text-slate-800"
                                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold truncate max-w-[70%] flex items-center gap-1.5">
                                        <MessageSquare className="w-3 h-3 shrink-0 text-gray-400" />
                                        {req.creator_type === "CLIENT" ? "Question Client" : "Message Consultant"}
                                    </span>
                                    <span
                                        className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${
                                            req.status === "PENDING"
                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                : req.status === "RESOLVED"
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : "bg-slate-100 text-slate-700 border-slate-200"
                                        }`}
                                    >
                                        {req.status === "PENDING" ? "EN ATTENTE" : req.status === "RESOLVED" ? "RÉSOLU" : "RÉPONDU"}
                                    </span>
                                </div>
                                <p className="text-[10px] truncate opacity-70">
                                    {req.message}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Bouton Renvoyer au client en bas de la sidebar */}
                    <div className="p-3 border-t border-gray-200 bg-gray-50 shrink-0">
                        <button
                            onClick={() => returnToClientMutation.mutate()}
                            disabled={
                                returnToClientMutation.isPending ||
                                !dossier.dossierRequests?.some((r: any) => r.status === "PENDING")
                            }
                            className="w-full py-2 bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                        >
                            {returnToClientMutation.isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Send className="w-3.5 h-3.5" />
                            )}
                            <span>Renvoyer au Client</span>
                        </button>
                    </div>
                </div>

                {/* ZONE PRINCIPALE (NOUVEAU MESSAGE ou THREAD) */}
                <div className="w-2/3 flex flex-col border border-gray-200 rounded-xl bg-gray-50 overflow-hidden relative">
                    {selectedRequestId === null ? (
                        // FORMULAIRE NOUVEAU MESSAGE DIRECT
                        <div className="flex-1 flex flex-col p-4">
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Plus className="w-4 h-4 text-slate-500" />
                                Nouvelle question ou message pour le client
                            </h4>
                            {requestError && (
                                <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-2 rounded mb-3">
                                    {requestError}
                                </div>
                            )}
                            <form onSubmit={handleCreateRequest} className="space-y-4">
                                <div>
                                    <label className="block text-[11px] text-gray-600 font-medium mb-1">
                                        Message / Question pour le client
                                    </label>
                                    <textarea
                                        value={requestMessage}
                                        onChange={(e) => setRequestMessage(e.target.value)}
                                        rows={6}
                                        placeholder="Ex: Bonjour, pouvez-vous nous préciser le détail des charges du personnel ou l'historique du chiffre d'affaires..."
                                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none resize-none leading-relaxed"
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        Pour toute demande ou renouvellement de pièce justificative (fichier), rendez-vous directement dans l'onglet <strong>Pièces</strong>.
                                    </p>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={createRequestPending || !requestMessage.trim()}
                                        className="flex items-center space-x-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                                    >
                                        {createRequestPending ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        <span>Envoyer le message</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        // AFFICHAGE DU THREAD (MESSAGES)
                        (() => {
                            const req = dossier.dossierRequests?.find((r: any) => r.id === selectedRequestId);
                            if (!req) return null;
                            return (
                                <div className="flex-1 flex flex-col h-full">
                                    {/* En-tête du Thread */}
                                    <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                                        <div>
                                            <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                                <span>{req.input_type === "FILE" ? "Demande de Fichier" : "Échange direct"}</span>
                                                <span className="text-[10px] text-gray-500 font-mono">#{req.id}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-0.5 truncate max-w-sm">
                                                Objet : {req.message}
                                            </div>
                                        </div>
                                        {req.status !== "RESOLVED" && (
                                            <button
                                                onClick={() => resolveMutation.mutate(req.id)}
                                                disabled={resolveMutation.isPending}
                                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded transition-colors flex items-center gap-1 cursor-pointer"
                                            >
                                                {resolveMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                                Clôturer
                                            </button>
                                        )}
                                    </div>

                                    {req.input_type === "FILE" ? (
                                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500 space-y-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                                                <FolderOpen className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 mb-1">Demande de Document</h3>
                                                <p className="text-xs text-gray-600 max-w-sm">
                                                    Cette requête concerne la transmission d'un fichier ("{req.message}"). Veuillez vous rendre dans l'onglet "Pièces" pour consulter ou gérer ce document.
                                                </p>
                                            </div>
                                            <button
                                                onClick={onGoToDocs}
                                                className="mt-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                                            >
                                                Aller aux Pièces
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Liste des messages */}
                                            <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3">
                                                {req.messages?.map((msg: any) => {
                                                    const isMe = msg.sender_type === "CONSULTANT";
                                                    return (
                                                        <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                                            <span className="text-[9px] text-gray-500 mb-0.5 px-1">
                                                                {isMe ? "Moi (Expert)" : "Client"} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            <div
                                                                className={`max-w-[85%] rounded-xl p-2.5 text-xs ${isMe
                                                                    ? "bg-slate-700 text-white rounded-tr-sm"
                                                                    : "bg-white text-gray-900 rounded-tl-sm border border-gray-200 shadow-sm"
                                                                }`}
                                                            >
                                                                {msg.message && <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>}
                                                                {msg.attachment_url && (
                                                                    <a
                                                                        href={`${import.meta.env.VITE_PREFIX_URL || "http://localhost:5000/uploads"}/dossiers/${dossierId}/${msg.attachment_url}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={`flex items-center gap-1.5 mt-2 p-1.5 rounded text-[10px] font-medium transition-colors ${
                                                                            isMe ? "bg-slate-600 hover:bg-slate-500" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                                                        }`}
                                                                    >
                                                                        <FileText className="w-3.5 h-3.5" />
                                                                        <span>Pièce jointe</span>
                                                                        <Download className="w-3 h-3 ml-auto" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Zone de réponse */}
                                            <form
                                                onSubmit={(e) => handleReplySubmit(e, req.id)}
                                                className="p-2 border-t border-gray-200 bg-gray-50 shrink-0 flex items-end gap-2"
                                            >
                                                <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden focus-within:border-slate-600 focus-within:ring-1 focus-within:ring-slate-600 transition-all">
                                                    <textarea
                                                        value={replyMessage}
                                                        onChange={(e) => setReplyMessage(e.target.value)}
                                                        placeholder={req.status === "RESOLVED" ? "Répondre (Rouvrira la requête)..." : "Répondre..."}
                                                        rows={1}
                                                        className="w-full bg-transparent p-2.5 text-xs text-gray-900 outline-none resize-none max-h-24"
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleReplySubmit(e, req.id);
                                                            }
                                                        }}
                                                    />
                                                    {replyFile && (
                                                        <div className="px-2.5 py-1.5 bg-gray-100 border-t border-gray-200 flex justify-between items-center text-[10px]">
                                                            <span className="text-gray-700 truncate max-w-[80%]">{replyFile.name}</span>
                                                            <button type="button" onClick={() => setReplyFile(null)} className="text-red-500 hover:text-red-600">
                                                                ✕
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0 pb-1">
                                                    <label className="p-1.5 text-gray-500 hover:text-slate-700 hover:bg-gray-100 rounded cursor-pointer transition-colors">
                                                        <Paperclip className="w-4 h-4" />
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            onChange={(e) => e.target.files && setReplyFile(e.target.files[0])}
                                                        />
                                                    </label>
                                                    <button
                                                        type="submit"
                                                        disabled={replyMutation.isPending || (!replyMessage.trim() && !replyFile)}
                                                        className="p-1.5 bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white rounded transition-colors cursor-pointer"
                                                    >
                                                        {replyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                </div>
                            );
                        })()
                    )}
                </div>
            </div>
        </div>
    );
};

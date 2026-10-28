import React, { useMemo } from "react";
import {
    Building2,
    Briefcase,
    Coins,
    PieChart,
    Layers,
    Edit3,
    Save,
    Sparkles,
    Loader2,
    FileCheck2,
    CheckCircle2,
    FileText,
    Download,
    Trash2,
    UploadCloud,
} from "lucide-react";
import {
    REGIONS_ET_PROVINCES,
    SECTEURS_ACTIVITE,
    BRANCHES_ACTIVITE,
    BANQUES_PARTENAIRES,
    PROFILS_MONTEE_CHARGE,
    getProvincesForRegion,
    getProvinceDetails,
    type BrancheInfo,
    type SecteurInfo,
} from "../../client/stepper/tpmeReferentiels";
import { formatMAD, formatPercent } from "../../client/stepper/useStepperMath";

interface StudioStepperTabProps {
    dossier: any;
    dossierId: number;
    stepperFormData: Record<string, any>;
    setStepperFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    handleSaveStepper: (autoAdvance: boolean, triggerMlops?: boolean) => void;
    isSaving: boolean;
    fileFiscaleUpload: File | null;
    setFileFiscaleUpload: (file: File | null) => void;
    fileRCUpload: File | null;
    setFileRCUpload: (file: File | null) => void;
    fileCNSSUpload: File | null;
    setFileCNSSUpload: (file: File | null) => void;
    fileFiscaleRef: any | null;
    setFileFiscaleRef: (ref: any | null) => void;
    fileRCRef: any | null;
    setFileRCRef: (ref: any | null) => void;
    fileCNSSRef: any | null;
    setFileCNSSRef: (ref: any | null) => void;
}

export const StudioStepperTab: React.FC<StudioStepperTabProps> = ({
    dossier,
    dossierId,
    stepperFormData,
    setStepperFormData,
    handleSaveStepper,
    isSaving,
    fileFiscaleUpload,
    setFileFiscaleUpload,
    fileRCUpload,
    setFileRCUpload,
    fileCNSSUpload,
    setFileCNSSUpload,
    fileFiscaleRef,
    setFileFiscaleRef,
    fileRCRef,
    setFileRCRef,
    fileCNSSRef,
    setFileCNSSRef,
}) => {
    // Liste consolidée de tous les documents disponibles dans le dossier
    const availableClientFiles = useMemo(() => {
        if (!dossier) return [];
        const filesMap = new Map<string, { id: string; name: string; source: string; filename: string; documentId?: number; url: string; size?: number; date?: string; type: "document" | "attachment" }>();

        // 1. Requirements avec document uploadé
        dossier.requirements?.forEach((req: any) => {
            if (req.uploadedDocument?.filename) {
                const doc = req.uploadedDocument;
                filesMap.set(doc.filename, {
                    id: `doc-${doc.id}`,
                    name: doc.original_name || doc.filename,
                    source: `Checklist : ${req.label}`,
                    filename: doc.filename,
                    documentId: doc.id,
                    url: `${import.meta.env.VITE_BACKEND_API_URL || ""}/${doc.file_path}`,
                    size: Number(doc.file_size) || undefined,
                    date: doc.createdAt,
                    type: "document",
                });
            }
        });

        // 2. Documents directs
        dossier.documents?.forEach((doc: any) => {
            if (doc.filename && !filesMap.has(doc.filename)) {
                filesMap.set(doc.filename, {
                    id: `doc-${doc.id}`,
                    name: doc.original_name || doc.filename,
                    source: "Documents dossier",
                    filename: doc.filename,
                    documentId: doc.id,
                    url: `${import.meta.env.VITE_BACKEND_API_URL || ""}/${doc.file_path}`,
                    size: Number(doc.file_size) || undefined,
                    date: doc.createdAt,
                    type: "document",
                });
            }
        });

        // 3. Pièces jointes des réponses aux demandes (chat / requests)
        dossier.dossierRequests?.forEach((req: any) => {
            req.messages?.forEach((msg: any) => {
                if (msg.attachment_url && !filesMap.has(msg.attachment_url)) {
                    filesMap.set(msg.attachment_url, {
                        id: `att-${msg.id}`,
                        name: msg.attachment_url,
                        source: `Demande #${req.id} : ${req.documentType?.name || req.message}`,
                        filename: msg.attachment_url,
                        url: `${import.meta.env.VITE_PREFIX_URL || "http://localhost:5000/uploads"}/dossiers/${dossierId}/${msg.attachment_url}`,
                        date: msg.createdAt,
                        type: "attachment",
                    });
                }
            });
        });

        return Array.from(filesMap.values());
    }, [dossier, dossierId]);

    const existingFiscaleDoc = useMemo(() => {
        return dossier?.requirements?.find((r: any) => {
            const l = (r.label || "").toLowerCase();
            return l.includes("fiscale") || l.includes("impôt") || l.includes("dgi");
        })?.uploadedDocument;
    }, [dossier]);

    const existingRCDoc = useMemo(() => {
        return dossier?.requirements?.find((r: any) => {
            const l = (r.label || "").toLowerCase();
            return l.includes("commerce") || l.includes("rc");
        })?.uploadedDocument;
    }, [dossier]);

    const existingCNSSDoc = useMemo(() => {
        return dossier?.requirements?.find((r: any) => {
            const l = (r.label || "").toLowerCase();
            return l.includes("cnss");
        })?.uploadedDocument;
    }, [dossier]);

    // Calculs dynamiques temps réel pour l'expert
    const capexEtudes = Number(stepperFormData.capex_etudes) || 0;
    const capexFoncier = stepperFormData.regime_foncier === "LOCATION" ? 0 : (Number(stepperFormData.capex_foncier) || 0);
    const capexImmeuble = Number(stepperFormData.capex_immeuble) || 0;
    const capexAmenagement = Number(stepperFormData.capex_amenagement) || 0;
    const capexMateriel = Number(stepperFormData.capex_materiel) || 0;
    const capexDivers = Number(stepperFormData.capex_divers) || 0;
    const totalCapex = capexEtudes + capexFoncier + capexImmeuble + capexAmenagement + capexMateriel + capexDivers;

    const selectedProv = getProvinceDetails(stepperFormData.region_id, stepperFormData.province_id);
    const tauxTerritoriale = selectedProv?.rate || 0;
    const tauxPrioritaire = stepperFormData.is_activite_prioritaire ? 0.10 : 0;
    const emplois = Math.max(0, Number(stepperFormData.emplois_directs) || 0);
    const ratioEmploiCapex = totalCapex > 0 ? (emplois / totalCapex) * 1000000 : 0;
    let tauxEmploi = 0;
    if (ratioEmploiCapex >= 2 && ratioEmploiCapex <= 5) tauxEmploi = 0.05;
    else if (ratioEmploiCapex > 5 && ratioEmploiCapex <= 10) tauxEmploi = 0.07;
    else if (ratioEmploiCapex > 10) tauxEmploi = 0.10;
    const tauxGlobal = Math.min(0.30, tauxTerritoriale + tauxPrioritaire + tauxEmploi);
    const montantSubventionEstime = totalCapex * tauxGlobal;

    const filteredBranches = BRANCHES_ACTIVITE.filter(
        (b: BrancheInfo) => !stepperFormData.secteur_activite || b.sectorCode === stepperFormData.secteur_activite
    );

    return (
        <div className="space-y-6 pb-6">
            {dossier.is_delegated && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-3 text-indigo-900 shadow-xs">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700 shrink-0">
                        <Edit3 className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider">Montage Délégué au Consultant (Plan 2)</h4>
                        <p className="text-xs text-indigo-700 mt-0.5">
                            Le client a confié la saisie des caractéristiques du projet à l'expert. Complétez les paramètres et associez les 3 pièces maîtresses (reçues du client ou uploadées) pour déclencher l'extraction MLOps et hydrater le dossier d'investissement.
                        </p>
                    </div>
                </div>
            )}

            {/* Barre de KPI & Actions */}
            <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Simulation en direct</span>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>Synthèse d'Éligibilité TPME</span>
                            {stepperFormData.is_activite_prioritaire && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                                    +10% Prioritaire
                                </span>
                            )}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleSaveStepper(false, false)}
                            disabled={isSaving}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors border border-slate-700 cursor-pointer"
                        >
                            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            <span>Enregistrer brouillon</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSaveStepper(true, true)}
                            disabled={isSaving}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-200" />}
                            <span>Valider & Déclencher IA (MLOps)</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block font-medium">CAPEX Total</span>
                        <span className="text-sm font-bold text-white">{formatMAD(totalCapex)}</span>
                    </div>
                    <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block font-medium">Zonage Territoire</span>
                        <span className="text-xs font-bold text-cyan-300">{selectedProv?.zone || "Hors Zone"} ({formatPercent(tauxTerritoriale)})</span>
                    </div>
                    <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block font-medium">Prime Cumulée</span>
                        <span className="text-sm font-bold text-emerald-400">{formatPercent(tauxGlobal)}</span>
                    </div>
                    <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block font-medium">Subvention Estimée</span>
                        <span className="text-sm font-bold text-amber-300">{formatMAD(montantSubventionEstime)}</span>
                    </div>
                </div>
            </div>

            {/* 1. LOCALISATION & FONCIER */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                    <Building2 className="w-4 h-4 text-slate-600" />
                    <span>1. Localisation & Foncier (Territoire)</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Région</label>
                        <select
                            value={stepperFormData.region_id || ""}
                            onChange={(e) => {
                                const newRegion = e.target.value;
                                const provs = getProvincesForRegion(newRegion);
                                setStepperFormData({
                                    ...stepperFormData,
                                    region_id: newRegion,
                                    province_id: provs[0]?.id || "",
                                });
                            }}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        >
                            <option value="">Sélectionnez une région...</option>
                            {REGIONS_ET_PROVINCES.map((reg) => (
                                <option key={reg.id} value={reg.id}>{reg.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Province / Préfecture</label>
                        <select
                            value={stepperFormData.province_id || ""}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, province_id: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        >
                            <option value="">Sélectionnez une province...</option>
                            {getProvincesForRegion(stepperFormData.region_id).map((prov) => (
                                <option key={prov.id} value={prov.id}>
                                    {prov.label} — {prov.zone} ({formatPercent(prov.rate)})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Adresse complète d'implantation</label>
                        <input
                            type="text"
                            value={stepperFormData.adresse_projet || ""}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, adresse_projet: e.target.value })}
                            placeholder="Ex: Parc Industriel CFCIM, Lot 42, Bouskoura"
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Coordonnées GPS (Optionnel)</label>
                        <input
                            type="text"
                            value={stepperFormData.gps_coordinates || ""}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, gps_coordinates: e.target.value })}
                            placeholder="Ex: 33.4485, -7.6321"
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Régime foncier</label>
                        <select
                            value={stepperFormData.regime_foncier || "LOCATION"}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, regime_foncier: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        >
                            <option value="LOCATION">Bail commercial / Location</option>
                            <option value="ACQUISITION">Acquisition / Propriété foncière</option>
                        </select>
                    </div>
                    {stepperFormData.regime_foncier === "ACQUISITION" && (
                        <div className="col-span-2">
                            <label className="block text-[11px] font-medium text-gray-700 mb-1">Titre Foncier / Référence de Propriété</label>
                            <input
                                type="text"
                                value={stepperFormData.titre_foncier || ""}
                                onChange={(e) => setStepperFormData({ ...stepperFormData, titre_foncier: e.target.value })}
                                placeholder="Ex: TF 12345/C"
                                className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* 2. AMBITION & CARACTÉRISTIQUES */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                    <Briefcase className="w-4 h-4 text-slate-600" />
                    <span>2. Ambition, Secteur & Primes Charte</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Nature du projet</label>
                        <select
                            value={stepperFormData.nature_projet || "CREATION"}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, nature_projet: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        >
                            <option value="CREATION">Création d'entreprise (Greenfield)</option>
                            <option value="EXTENSION">Extension & Développement (Brownfield)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Emplois directs stables prévus</label>
                        <input
                            type="number"
                            min="1"
                            value={stepperFormData.emplois_directs ?? 3}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, emplois_directs: parseInt(e.target.value, 10) || 0 })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Secteur d'activité officiel</label>
                        <select
                            value={stepperFormData.secteur_activite || ""}
                            onChange={(e) => {
                                const newSec = e.target.value;
                                const secBranches = BRANCHES_ACTIVITE.filter((b: BrancheInfo) => b.sectorCode === newSec);
                                setStepperFormData({
                                    ...stepperFormData,
                                    secteur_activite: newSec,
                                    branche_activite: secBranches[0]?.label || "",
                                    is_activite_prioritaire: secBranches[0]?.isPrioritaire || false,
                                });
                            }}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        >
                            <option value="">Sélectionnez un secteur...</option>
                            {SECTEURS_ACTIVITE.map((sec: SecteurInfo) => (
                                <option key={sec.code} value={sec.code}>{sec.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Filière / Branche précise</label>
                        <select
                            value={stepperFormData.branche_activite || ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matchedBranch = BRANCHES_ACTIVITE.find((b: BrancheInfo) => b.label === val);
                                setStepperFormData({
                                    ...stepperFormData,
                                    branche_activite: val,
                                    is_activite_prioritaire: matchedBranch?.isPrioritaire || stepperFormData.is_activite_prioritaire,
                                });
                            }}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        >
                            <option value="">Sélectionnez une filière...</option>
                            {filteredBranches.map((br: BrancheInfo) => (
                                <option key={br.id} value={br.label}>
                                    {br.label} {br.isPrioritaire ? "★ (Prioritaire)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Toggle Activité Prioritaire (Prime sectorielle +10%) */}
                    <div className="col-span-2 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-bold text-amber-950">Bonus Prime Sectorielle (+10%)</span>
                            </div>
                            <p className="text-[11px] text-amber-800 mt-0.5">
                                Cochez si l'activité relève des secteurs prioritaires définis par le décret de la Charte de l'Investissement (Métiers mondiaux, transition écologique, souveraineté).
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                                type="checkbox"
                                checked={Boolean(stepperFormData.is_activite_prioritaire)}
                                onChange={(e) => setStepperFormData({ ...stepperFormData, is_activite_prioritaire: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                        </label>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Banque Partenaire / Chef de file</label>
                        <select
                            value={stepperFormData.banque_partenaire || "AWB"}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, banque_partenaire: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        >
                            {BANQUES_PARTENAIRES.map((bank) => (
                                <option key={bank.code} value={bank.code}>{bank.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* 3. PROGRAMME D'INVESTISSEMENT CAPEX */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-slate-600" />
                        <span>3. Programme d'Investissement CAPEX (MAD HT)</span>
                    </h4>
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        Total : {formatMAD(totalCapex)}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Matériel & Outillage de Production</label>
                        <input
                            type="number"
                            value={stepperFormData.capex_materiel ?? 0}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, capex_materiel: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Aménagements & Travaux</label>
                        <input
                            type="number"
                            value={stepperFormData.capex_amenagement ?? 0}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, capex_amenagement: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Constructions / Bâtiments Industriels</label>
                        <input
                            type="number"
                            value={stepperFormData.capex_immeuble ?? 0}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, capex_immeuble: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Foncier / Terrain (si acquisition)</label>
                        <input
                            type="number"
                            disabled={stepperFormData.regime_foncier === "LOCATION"}
                            value={stepperFormData.regime_foncier === "LOCATION" ? 0 : (stepperFormData.capex_foncier ?? 0)}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, capex_foncier: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600 disabled:bg-gray-100 disabled:text-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Études, R&D & Conseils</label>
                        <input
                            type="number"
                            value={stepperFormData.capex_etudes ?? 0}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, capex_etudes: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Frais préliminaires & Divers</label>
                        <input
                            type="number"
                            value={stepperFormData.capex_divers ?? 0}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, capex_divers: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        />
                    </div>
                </div>
            </div>

            {/* 4. FINANCEMENT & EXPLOITATION */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                    <PieChart className="w-4 h-4 text-slate-600" />
                    <span>4. Structure de Financement & Exploitation</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Mode de Financement</label>
                        <select
                            value={stepperFormData.mode_financement || "100_FONDS_PROPRES"}
                            onChange={(e) => {
                                const mode = e.target.value;
                                setStepperFormData({
                                    ...stepperFormData,
                                    mode_financement: mode,
                                    part_fonds_propres: mode === "100_FONDS_PROPRES" ? 100 : (stepperFormData.part_fonds_propres || 30),
                                    montant_dette: mode === "100_FONDS_PROPRES" ? 0 : (totalCapex * 0.7),
                                });
                            }}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        >
                            <option value="100_FONDS_PROPRES">100% Fonds Propres (Autofinancement)</option>
                            <option value="MIXTE">Mixte (Fonds Propres + Crédit d'Investissement)</option>
                        </select>
                    </div>

                    {stepperFormData.mode_financement === "MIXTE" ? (
                        <>
                            <div>
                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Part Fonds Propres (%)</label>
                                <input
                                    type="number"
                                    min="10"
                                    max="90"
                                    value={stepperFormData.part_fonds_propres ?? 30}
                                    onChange={(e) => {
                                        const fp = parseFloat(e.target.value) || 0;
                                        setStepperFormData({
                                            ...stepperFormData,
                                            part_fonds_propres: fp,
                                            montant_dette: (totalCapex * (100 - fp)) / 100,
                                        });
                                    }}
                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Taux d'intérêt de la dette (%)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={stepperFormData.dette_taux ?? 6.5}
                                    onChange={(e) => setStepperFormData({ ...stepperFormData, dette_taux: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-medium text-gray-700 mb-1">Durée du crédit (Années)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="15"
                                    value={stepperFormData.dette_duree ?? 7}
                                    onChange={(e) => setStepperFormData({ ...stepperFormData, dette_duree: parseInt(e.target.value, 10) || 7 })}
                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3">
                            Aucun endettement bancaire prévu pour ce projet.
                        </div>
                    )}

                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Année de démarrage d'exploitation</label>
                        <input
                            type="number"
                            value={stepperFormData.annee_demarrage ?? new Date().getFullYear()}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, annee_demarrage: parseInt(e.target.value, 10) || new Date().getFullYear() })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">CA Cible Croisière (MAD/an)</label>
                        <input
                            type="number"
                            value={stepperFormData.ca_cible_croisiere ?? 0}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, ca_cible_croisiere: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Profil de Montée en Charge</label>
                        <select
                            value={stepperFormData.profil_montee_charge || "STANDARD"}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, profil_montee_charge: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        >
                            {PROFILS_MONTEE_CHARGE.map((p) => (
                                <option key={p.id} value={p.id}>{p.label} ({p.description})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Ratio COGS / Achats consommés (%)</label>
                        <input
                            type="number"
                            value={stepperFormData.ratio_cogs ?? 25}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, ratio_cogs: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Salaire moyen brut (MAD/mois)</label>
                        <input
                            type="number"
                            value={stepperFormData.salaire_moyen_brut ?? 4500}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, salaire_moyen_brut: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Part Exportée du CA (%)</label>
                        <input
                            type="number"
                            value={stepperFormData.part_export ?? 0}
                            onChange={(e) => setStepperFormData({ ...stepperFormData, part_export: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-slate-600"
                        />
                    </div>
                </div>
            </div>

            {/* 5. RÉFÉRENCEMENT & TÉLÉVERSEMENT DES PIÈCES OFFICIELLES (MLOps) */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 shadow-xs">
                <div className="border-b border-gray-100 pb-2">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        <span>5. Pièces Justificatives Officielles & Transmission MLOps</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                        Pour chaque pièce obligatoire, sélectionnez un document déjà transmis par le client dans les échanges, ou téléversez directement le PDF si vous l'avez reçu par ailleurs.
                    </p>
                </div>

                <div className="space-y-3">
                    {/* Slot 1 : Attestation Fiscale */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                                <span className="text-xs font-bold text-gray-900">
                                    Attestation de Régularité Fiscale (DGI)
                                </span>
                            </div>
                            {fileFiscaleUpload ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                    <FileCheck2 className="w-3 h-3" /> Nouveau fichier prêt
                                </span>
                            ) : fileFiscaleRef ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Fichier client référencé
                                </span>
                            ) : existingFiscaleDoc ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Déjà présent sur le dossier
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                    En attente de rattachement
                                </span>
                            )}
                        </div>

                        {/* Détails du document actuellement actif */}
                        {(fileFiscaleUpload || fileFiscaleRef || existingFiscaleDoc) && (
                            <div className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                                <div className="truncate flex items-center gap-1.5 text-gray-800">
                                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span className="font-semibold truncate">
                                        {fileFiscaleUpload?.name || fileFiscaleRef?.name || existingFiscaleDoc?.original_name || existingFiscaleDoc?.filename}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {(fileFiscaleRef?.url || existingFiscaleDoc?.file_path) && (
                                        <a
                                            href={fileFiscaleRef?.url || `${import.meta.env.VITE_BACKEND_API_URL || ""}/${existingFiscaleDoc?.file_path || ""}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                                        >
                                            <Download className="w-3 h-3" /> Aperçu
                                        </a>
                                    )}
                                    {(fileFiscaleUpload || fileFiscaleRef) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFileFiscaleUpload(null);
                                                setFileFiscaleRef(null);
                                            }}
                                            className="text-red-500 hover:text-red-700 text-xs p-1 cursor-pointer"
                                            title="Détacher"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                                <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                    Option A : Sélectionner parmi les fichiers reçus du client
                                </label>
                                <select
                                    value={fileFiscaleRef?.filename || ""}
                                    onChange={(e) => {
                                        const chosen = availableClientFiles.find((f) => f.filename === e.target.value);
                                        setFileFiscaleRef(chosen || null);
                                        if (chosen) setFileFiscaleUpload(null);
                                    }}
                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-800 outline-none focus:ring-1 focus:ring-indigo-600"
                                >
                                    <option value="">-- Choisir un document client ({availableClientFiles.length} dispo) --</option>
                                    {availableClientFiles.map((file) => (
                                        <option key={file.id} value={file.filename}>
                                            {file.name} ({file.source})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                    Option B : Ou téléverser directement le PDF
                                </label>
                                <label className="flex items-center justify-center gap-1.5 p-2 bg-white hover:bg-slate-50 border border-dashed border-gray-300 hover:border-indigo-400 rounded-lg text-xs text-gray-600 hover:text-indigo-700 cursor-pointer transition-colors">
                                    <UploadCloud className="w-3.5 h-3.5" />
                                    <span>{fileFiscaleUpload ? fileFiscaleUpload.name : "Téléverser nouveau PDF"}</span>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setFileFiscaleUpload(e.target.files[0]);
                                                setFileFiscaleRef(null);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Slot 2 : Registre de Commerce (Modèle 7) */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                                <span className="text-xs font-bold text-gray-900">
                                    Registre de Commerce (Modèle 7 / RC)
                                </span>
                            </div>
                            {fileRCUpload ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                    <FileCheck2 className="w-3 h-3" /> Nouveau fichier prêt
                                </span>
                            ) : fileRCRef ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Fichier client référencé
                                </span>
                            ) : existingRCDoc ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Déjà présent sur le dossier
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                    En attente de rattachement
                                </span>
                            )}
                        </div>

                        {(fileRCUpload || fileRCRef || existingRCDoc) && (
                            <div className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                                <div className="truncate flex items-center gap-1.5 text-gray-800">
                                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span className="font-semibold truncate">
                                        {fileRCUpload?.name || fileRCRef?.name || existingRCDoc?.original_name || existingRCDoc?.filename}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {(fileRCRef?.url || existingRCDoc?.file_path) && (
                                        <a
                                            href={fileRCRef?.url || `${import.meta.env.VITE_BACKEND_API_URL || ""}/${existingRCDoc?.file_path || ""}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                                        >
                                            <Download className="w-3 h-3" /> Aperçu
                                        </a>
                                    )}
                                    {(fileRCUpload || fileRCRef) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFileRCUpload(null);
                                                setFileRCRef(null);
                                            }}
                                            className="text-red-500 hover:text-red-700 text-xs p-1 cursor-pointer"
                                            title="Détacher"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                                <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                    Option A : Sélectionner parmi les fichiers reçus du client
                                </label>
                                <select
                                    value={fileRCRef?.filename || ""}
                                    onChange={(e) => {
                                        const chosen = availableClientFiles.find((f) => f.filename === e.target.value);
                                        setFileRCRef(chosen || null);
                                        if (chosen) setFileRCUpload(null);
                                    }}
                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-800 outline-none focus:ring-1 focus:ring-indigo-600"
                                >
                                    <option value="">-- Choisir un document client ({availableClientFiles.length} dispo) --</option>
                                    {availableClientFiles.map((file) => (
                                        <option key={file.id} value={file.filename}>
                                            {file.name} ({file.source})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                    Option B : Ou téléverser directement le PDF
                                </label>
                                <label className="flex items-center justify-center gap-1.5 p-2 bg-white hover:bg-slate-50 border border-dashed border-gray-300 hover:border-indigo-400 rounded-lg text-xs text-gray-600 hover:text-indigo-700 cursor-pointer transition-colors">
                                    <UploadCloud className="w-3.5 h-3.5" />
                                    <span>{fileRCUpload ? fileRCUpload.name : "Téléverser nouveau PDF"}</span>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setFileRCUpload(e.target.files[0]);
                                                setFileRCRef(null);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Slot 3 : Attestation CNSS */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                                <span className="text-xs font-bold text-gray-900">
                                    Attestation d'Affiliation CNSS
                                </span>
                            </div>
                            {fileCNSSUpload ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                    <FileCheck2 className="w-3 h-3" /> Nouveau fichier prêt
                                </span>
                            ) : fileCNSSRef ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Fichier client référencé
                                </span>
                            ) : existingCNSSDoc ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Déjà présent sur le dossier
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                    En attente de rattachement
                                </span>
                            )}
                        </div>

                        {(fileCNSSUpload || fileCNSSRef || existingCNSSDoc) && (
                            <div className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                                <div className="truncate flex items-center gap-1.5 text-gray-800">
                                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span className="font-semibold truncate">
                                        {fileCNSSUpload?.name || fileCNSSRef?.name || existingCNSSDoc?.original_name || existingCNSSDoc?.filename}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {(fileCNSSRef?.url || existingCNSSDoc?.file_path) && (
                                        <a
                                            href={fileCNSSRef?.url || `${import.meta.env.VITE_BACKEND_API_URL || ""}/${existingCNSSDoc?.file_path || ""}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                                        >
                                            <Download className="w-3 h-3" /> Aperçu
                                        </a>
                                    )}
                                    {(fileCNSSUpload || fileCNSSRef) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFileCNSSUpload(null);
                                                setFileCNSSRef(null);
                                            }}
                                            className="text-red-500 hover:text-red-700 text-xs p-1 cursor-pointer"
                                            title="Détacher"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                                <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                    Option A : Sélectionner parmi les fichiers reçus du client
                                </label>
                                <select
                                    value={fileCNSSRef?.filename || ""}
                                    onChange={(e) => {
                                        const chosen = availableClientFiles.find((f) => f.filename === e.target.value);
                                        setFileCNSSRef(chosen || null);
                                        if (chosen) setFileCNSSUpload(null);
                                    }}
                                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-800 outline-none focus:ring-1 focus:ring-indigo-600"
                                >
                                    <option value="">-- Choisir un document client ({availableClientFiles.length} dispo) --</option>
                                    {availableClientFiles.map((file) => (
                                        <option key={file.id} value={file.filename}>
                                            {file.name} ({file.source})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-medium text-gray-500 mb-1">
                                    Option B : Ou téléverser directement le PDF
                                </label>
                                <label className="flex items-center justify-center gap-1.5 p-2 bg-white hover:bg-slate-50 border border-dashed border-gray-300 hover:border-indigo-400 rounded-lg text-xs text-gray-600 hover:text-indigo-700 cursor-pointer transition-colors">
                                    <UploadCloud className="w-3.5 h-3.5" />
                                    <span>{fileCNSSUpload ? fileCNSSUpload.name : "Téléverser nouveau PDF"}</span>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setFileCNSSUpload(e.target.files[0]);
                                                setFileCNSSRef(null);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

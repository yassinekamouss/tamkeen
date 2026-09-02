import React, { useState, useEffect } from "react";
import {
    Building2,
    Target,
    Briefcase,
    Users,
    Code,
    Eye,
    Save,
    Loader2,
    AlertCircle,
    Calculator,
} from "lucide-react";

interface DossierDataFormEditorProps {
    value: Record<string, any>;
    onChange: (updatedJson: Record<string, any>) => void;
    onSave: () => void;
    isSaving: boolean;
    error: string | null;
}

export const DossierDataFormEditor: React.FC<DossierDataFormEditorProps> = ({
    value,
    onChange,
    onSave,
    isSaving,
    error,
}) => {
    // Mode de vue: 'VISUAL' (Formulaire structuré) ou 'CODE' (JSON brut)
    const [viewMode, setViewMode] = useState<"VISUAL" | "CODE">("VISUAL");
    
    // Sous-onglet du formulaire visuel
    const [activeSection, setActiveSection] = useState<
        "ENTREPRISE" | "PROJET" | "PROGRAMME" | "CPC" | "IMPACTS"
    >("ENTREPRISE");

    // État local JSON textuel pour le mode CODE
    const [rawJsonText, setRawJsonText] = useState<string>("");
    const [jsonSyntaxError, setJsonSyntaxError] = useState<string | null>(null);

    // Initialisation & Sync local
    useEffect(() => {
        setRawJsonText(JSON.stringify(value || {}, null, 2));
    }, [value]);

    const handleRawTextChange = (text: string) => {
        setRawJsonText(text);
        try {
            const parsed = JSON.parse(text);
            setJsonSyntaxError(null);
            onChange(parsed);
        } catch (e: any) {
            setJsonSyntaxError(e.message);
        }
    };

    // Helper pour mettre à jour une valeur imbriquée en toute sécurité
    const updatePath = (path: string[], val: any) => {
        const copy = JSON.parse(JSON.stringify(value || {}));
        let current = copy;
        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) {
                current[path[i]] = {};
            }
            current = current[path[i]];
        }
        current[path[path.length - 1]] = val;
        
        // Recalculer automatiquement les totaux si la section CPC ou IMPACTS est modifiée
        recalculateFinancials(copy);
        onChange(copy);
    };

    // Recalcul automatique des lignes du CPC & Matrice d'Impacts
    const recalculateFinancials = (data: Record<string, any>) => {
        const yearsCPC = ["2026", "2027", "2028", "2029", "2030", "2031"];
        const cpc = data.cpc || {};
        
        if (cpc.ca) {
            const totalCharges: Record<string, number> = {};
            const resExp: Record<string, number> = {};
            const resCourant: Record<string, number> = {};
            const resAvantImp: Record<string, number> = {};
            const resNet: Record<string, number> = {};

            yearsCPC.forEach((yr) => {
                const achats = parseFloat(cpc.achats?.[yr] || 0) || 0;
                const ext = parseFloat(cpc.charges_externes?.[yr] || 0) || 0;
                const pers = parseFloat(cpc.personnel?.[yr] || 0) || 0;
                const dot = parseFloat(cpc.dotations_exploitation?.[yr] || 0) || 0;
                
                const totalChg = achats + ext + pers + dot;
                totalCharges[yr] = totalChg;

                const ca = parseFloat(cpc.ca?.[yr] || 0) || 0;
                const re = ca - totalChg;
                resExp[yr] = re;
                resCourant[yr] = re;
                resAvantImp[yr] = re;

                const imp = parseFloat(cpc.impots_resultats?.[yr] || 0) || 0;
                resNet[yr] = re - imp;
            });

            cpc.total_charges_exploitation = totalCharges;
            cpc.resultat_exploitation = resExp;
            cpc.resultat_courant = resCourant;
            cpc.resultat_avant_impots = resAvantImp;
            cpc.resultat_net = resNet;
        }

        // Impacts Socio-Économiques : Totaux Horizontaux & Effectif Cumulé
        const impacts = data.impacts_socio_economiques || {};
        const rowsToSum = ["ca_global", "ca_lie", "va_globale", "va_liee", "directs", "indirects"];
        
        rowsToSum.forEach((rowKey) => {
            if (impacts[rowKey]) {
                let rowSum = 0;
                yearsCPC.forEach((yr) => {
                    rowSum += parseFloat(impacts[rowKey][yr] || 0) || 0;
                });
                impacts[rowKey].total = rowSum;
            }
        });

        // Effectif cumulé
        if (impacts.directs && impacts.indirects) {
            const effectif: Record<string, number> = {};
            let effectifTotal = 0;
            yearsCPC.forEach((yr) => {
                const dir = parseFloat(impacts.directs[yr] || 0) || 0;
                const ind = parseFloat(impacts.indirects[yr] || 0) || 0;
                const sum = dir + ind;
                effectif[yr] = sum;
                effectifTotal += sum;
            });
            effectif.total = effectifTotal;
            impacts.effectif_cumule = effectif;
        }
    };

    // Raccourcis vers les sous-arbres du JSON
    const pres = value.presentation_generale || {};
    const ent = pres.entreprise || {};
    const caHist = ent.ca_historique || {};
    const prj = pres.projet || {};
    const prog = value.programme_investissement || {};
    const rubriques = prog.rubriques || {};
    const planning = prog.planning || {};
    const cpc = value.cpc || {};
    const impacts = value.impacts_socio_economiques || {};

    const yearsCPC = ["2026", "2027", "2028", "2029", "2030", "2031"];
    const yearsPlanning = ["2026", "2027", "2028"];

    return (
        <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* BARRE SUPÉRIEURE : SÉLECTEUR DE MODE & BOUTON ENREGISTRER */}
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0 gap-3">
                {/* TOGGLE VUE VISUELLE / VUE CODE */}
                <div className="flex items-center bg-gray-200 p-0.5 rounded-lg border border-gray-300">
                    <button
                        type="button"
                        onClick={() => setViewMode("VISUAL")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            viewMode === "VISUAL"
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Formulaire Visuel</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode("CODE")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            viewMode === "CODE"
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <Code className="w-3.5 h-3.5" />
                        <span>Code JSON</span>
                    </button>
                </div>

                {/* BOUTON SAUVEGARDE */}
                <button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving || !!jsonSyntaxError}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm"
                >
                    {isSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Enregistrer & Ré-hydrater</span>
                </button>
            </div>

            {/* BARRE DES SOUS-ONGLETS (EN MODE VISUEL) */}
            {viewMode === "VISUAL" && (
                <div className="flex items-center gap-1 px-3 pt-2 bg-white border-b border-gray-200 overflow-x-auto shrink-0">
                    <button
                        onClick={() => setActiveSection("ENTREPRISE")}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
                            activeSection === "ENTREPRISE"
                                ? "border-slate-700 text-slate-800 bg-slate-50"
                                : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                    >
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Entreprise</span>
                    </button>

                    <button
                        onClick={() => setActiveSection("PROJET")}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
                            activeSection === "PROJET"
                                ? "border-slate-700 text-slate-800 bg-slate-50"
                                : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                    >
                        <Target className="w-3.5 h-3.5 text-slate-500" />
                        <span>Projet</span>
                    </button>

                    <button
                        onClick={() => setActiveSection("PROGRAMME")}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
                            activeSection === "PROGRAMME"
                                ? "border-slate-700 text-slate-800 bg-slate-50"
                                : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                    >
                        <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                        <span>Programme & Planning</span>
                    </button>

                    <button
                        onClick={() => setActiveSection("CPC")}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
                            activeSection === "CPC"
                                ? "border-slate-700 text-slate-800 bg-slate-50"
                                : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                    >
                        <Calculator className="w-3.5 h-3.5 text-slate-500" />
                        <span>CPC Prévisionnel</span>
                    </button>

                    <button
                        onClick={() => setActiveSection("IMPACTS")}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
                            activeSection === "IMPACTS"
                                ? "border-slate-700 text-slate-800 bg-slate-50"
                                : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                    >
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>Impacts Socio-Éco</span>
                    </button>
                </div>
            )}

            {/* CONTENU PRINCIPAL */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                {/* ERREURS */}
                {(error || jsonSyntaxError) && (
                    <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-mono shrink-0">
                        <div className="flex items-center gap-2 font-bold mb-1">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span>Attention</span>
                        </div>
                        {error || jsonSyntaxError}
                    </div>
                )}

                {/* MODE CODE : TEXTAREA BRUT */}
                {viewMode === "CODE" && (
                    <div className="h-full flex flex-col space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                            <span>JSON Structuré extrait par l'IA (LangGraph / DeepSeek)</span>
                            <span className="font-mono text-[10px]">Syntaxe UTF-8 JSON</span>
                        </div>
                        <textarea
                            value={rawJsonText}
                            onChange={(e) => handleRawTextChange(e.target.value)}
                            className="flex-1 w-full bg-gray-900 text-emerald-400 border border-gray-700 rounded-xl p-4 font-mono text-xs focus:ring-1 focus:ring-slate-500 outline-none resize-none leading-relaxed shadow-inner"
                            spellCheck={false}
                        />
                    </div>
                )}

                {/* MODE VISUEL : FORMULAIRES STRUCTURÉS */}
                {viewMode === "VISUAL" && (
                    <>
                        {/* SECTION 1 : ENTREPRISE */}
                        {activeSection === "ENTREPRISE" && (
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-slate-600" />
                                        Identité Juridique de l'Entreprise
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Raison Sociale / Nom</label>
                                            <input
                                                type="text"
                                                value={ent.nom || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "nom"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Forme Juridique</label>
                                            <input
                                                type="text"
                                                value={ent.forme_juridique || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "forme_juridique"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Identifiant Commun de l'Entreprise (ICE)</label>
                                            <input
                                                type="text"
                                                value={ent.ice || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "ice"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Registre du Commerce (RC)</label>
                                            <input
                                                type="text"
                                                value={ent.rc || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "rc"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Identifiant Fiscal (IF)</label>
                                            <input
                                                type="text"
                                                value={ent.identifiant_fiscal || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "identifiant_fiscal"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Affiliation CNSS</label>
                                            <input
                                                type="text"
                                                value={ent.cnss || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "cnss"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Capital Social (MAD)</label>
                                            <input
                                                type="text"
                                                value={ent.capital_social || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "capital_social"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date de Création</label>
                                            <input
                                                type="text"
                                                value={ent.date_creation || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "date_creation"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                                        Gouvernance & Activité Statutaire
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Représentant Légal / Dirigeant</label>
                                            <input
                                                type="text"
                                                value={ent.representant_legal || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "representant_legal"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Branche d'Activité</label>
                                            <input
                                                type="text"
                                                value={ent.branche_activite || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "branche_activite"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Adresse du Siège Social</label>
                                            <input
                                                type="text"
                                                value={ent.adresse_siege || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "adresse_siege"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Activité Statutaire Conforme aux Statuts</label>
                                            <textarea
                                                value={ent.activite_statutaire || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "activite_statutaire"], e.target.value)}
                                                rows={2}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                                        Chiffre d'Affaires Historique (en MAD)
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">CA 2023</label>
                                            <input
                                                type="text"
                                                value={caHist.ca_2023 || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "ca_historique", "ca_2023"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">CA 2024</label>
                                            <input
                                                type="text"
                                                value={caHist.ca_2024 || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "ca_historique", "ca_2024"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">CA 2025</label>
                                            <input
                                                type="text"
                                                value={caHist.ca_2025 || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "entreprise", "ca_historique", "ca_2025"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION 2 : PROJET */}
                        {activeSection === "PROJET" && (
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                                        <Target className="w-4 h-4 text-slate-600" />
                                        Fiche Descriptive du Projet d'Investissement
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="md:col-span-2">
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Intitulé / Description du Projet</label>
                                            <textarea
                                                value={prj.description || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "projet", "description"], e.target.value)}
                                                rows={2}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Lieu de Réalisation</label>
                                            <input
                                                type="text"
                                                value={prj.lieu_realisation || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "projet", "lieu_realisation"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Région</label>
                                            <input
                                                type="text"
                                                value={prj.region || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "projet", "region"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Coordonnées GPS</label>
                                            <input
                                                type="text"
                                                value={prj.coordonnees_gps || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "projet", "coordonnees_gps"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Statut Foncier / Info Terrain</label>
                                            <input
                                                type="text"
                                                value={prj.info_terrain || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "projet", "info_terrain"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Branche d'Activité Spécifique</label>
                                            <input
                                                type="text"
                                                value={prj.branche_activite || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "projet", "branche_activite"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Biens & Services Produits</label>
                                            <input
                                                type="text"
                                                value={prj.biens_services || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "projet", "biens_services"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mode de Financement</label>
                                            <input
                                                type="text"
                                                value={prj.mode_financement || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "projet", "mode_financement"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Banque Partenaire</label>
                                            <input
                                                type="text"
                                                value={prj.banque_partenaire || ""}
                                                onChange={(e) => updatePath(["presentation_generale", "projet", "banque_partenaire"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION 3 : PROGRAMME & PLANNING */}
                        {activeSection === "PROGRAMME" && (
                            <div className="space-y-4">
                                {/* RUBRIQUES D'INVESTISSEMENT */}
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                                        Budget par Rubrique (MAD)
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {["frais_etudes", "foncier_prive", "foncier_loyer", "infrastructures", "amenagements", "equipements", "autres"].map((key) => (
                                            <div key={key}>
                                                <label className="block text-[11px] font-semibold text-slate-700 mb-1 capitalize">
                                                    {key.replace("_", " ")}
                                                </label>
                                                <input
                                                    type="number"
                                                    value={rubriques[key] ?? 0}
                                                    onChange={(e) => updatePath(["programme_investissement", "rubriques", key], parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none font-mono"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* PLANNING D'INVESTISSEMENT (2026-2028) */}
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                                        Planning d'Investissement Pluriannuel (2026 - 2028)
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
                                                <tr>
                                                    <th className="p-2">Catégorie</th>
                                                    {yearsPlanning.map((yr) => (
                                                        <th key={yr} className="p-2 text-right">{yr}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {["frais_etudes", "bien_immeuble", "amenagements", "equipements"].map((rowKey) => (
                                                    <tr key={rowKey}>
                                                        <td className="p-2 font-medium capitalize text-slate-800">{rowKey.replace("_", " ")}</td>
                                                        {yearsPlanning.map((yr) => (
                                                            <td key={yr} className="p-2">
                                                                <input
                                                                    type="number"
                                                                    value={planning[rowKey]?.[yr] ?? 0}
                                                                    onChange={(e) => updatePath(["programme_investissement", "planning", rowKey, yr], parseFloat(e.target.value) || 0)}
                                                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs text-right font-mono focus:ring-1 focus:ring-slate-600 outline-none"
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                                <tr className="bg-slate-50 font-bold text-slate-900">
                                                    <td className="p-2 uppercase">TOTAL ANNUEL</td>
                                                    {yearsPlanning.map((yr) => (
                                                        <td key={yr} className="p-2 text-right font-mono">
                                                            {planning.total?.[yr] ?? 0} MAD
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION 4 : CPC PREVISIONNEL */}
                        {activeSection === "CPC" && (
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <Calculator className="w-4 h-4 text-slate-600" />
                                        Compte de Produits et de Charges Prévisionnel (2026-2031 en KMAD)
                                    </h3>
                                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                                        Recalcul automatique activé
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-left border-collapse">
                                        <thead className="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold uppercase text-[10px]">
                                            <tr>
                                                <th className="p-2.5 min-w-[180px]">Rubrique CPC</th>
                                                {yearsCPC.map((yr) => (
                                                    <th key={yr} className="p-2.5 text-center min-w-[90px]">{yr}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {/* Saisie : Chiffre d'Affaires */}
                                            <tr className="bg-emerald-50/50">
                                                <td className="p-2.5 font-bold text-emerald-900">Chiffre d'Affaires (CA)</td>
                                                {yearsCPC.map((yr) => (
                                                    <td key={yr} className="p-1.5">
                                                        <input
                                                            type="number"
                                                            value={cpc.ca?.[yr] ?? 0}
                                                            onChange={(e) => updatePath(["cpc", "ca", yr], parseFloat(e.target.value) || 0)}
                                                            className="w-full bg-white border border-emerald-300 rounded px-2 py-1 text-xs text-right font-mono font-bold text-emerald-900 focus:ring-1 focus:ring-emerald-500 outline-none"
                                                        />
                                                    </td>
                                                ))}
                                            </tr>

                                            {/* Saisies : Charges */}
                                            {["achats", "charges_externes", "personnel", "dotations_exploitation"].map((rowKey) => (
                                                <tr key={rowKey}>
                                                    <td className="p-2.5 font-medium capitalize text-gray-700">{rowKey.replace("_", " ")}</td>
                                                    {yearsCPC.map((yr) => (
                                                        <td key={yr} className="p-1.5">
                                                            <input
                                                                type="number"
                                                                value={cpc[rowKey]?.[yr] ?? 0}
                                                                onChange={(e) => updatePath(["cpc", rowKey, yr], parseFloat(e.target.value) || 0)}
                                                                className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs text-right font-mono focus:ring-1 focus:ring-slate-500 outline-none"
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}

                                            {/* Ligne Calculée : Total Charges */}
                                            <tr className="bg-amber-50 font-bold text-amber-900">
                                                <td className="p-2.5">TOTAL CHARGES EXPLOITATION</td>
                                                {yearsCPC.map((yr) => (
                                                    <td key={yr} className="p-2.5 text-right font-mono">
                                                        {cpc.total_charges_exploitation?.[yr] ?? 0}
                                                    </td>
                                                ))}
                                            </tr>

                                            {/* Ligne Calculée : Résultat Exploitation */}
                                            <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                                                <td className="p-2.5">RÉSULTAT EXPLOITATION</td>
                                                {yearsCPC.map((yr) => (
                                                    <td key={yr} className="p-2.5 text-right font-mono">
                                                        {cpc.resultat_exploitation?.[yr] ?? 0}
                                                    </td>
                                                ))}
                                            </tr>

                                            {/* Saisie : Impôts */}
                                            <tr>
                                                <td className="p-2.5 font-medium text-gray-700">Impôts sur les résultats</td>
                                                {yearsCPC.map((yr) => (
                                                    <td key={yr} className="p-1.5">
                                                        <input
                                                            type="number"
                                                            value={cpc.impots_resultats?.[yr] ?? 0}
                                                            onChange={(e) => updatePath(["cpc", "impots_resultats", yr], parseFloat(e.target.value) || 0)}
                                                            className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs text-right font-mono focus:ring-1 focus:ring-slate-500 outline-none"
                                                        />
                                                    </td>
                                                ))}
                                            </tr>

                                            {/* Ligne Calculée : Résultat Net */}
                                            <tr className="bg-slate-800 font-bold text-white">
                                                <td className="p-2.5">RÉSULTAT NET PREVISIONNEL</td>
                                                {yearsCPC.map((yr) => (
                                                    <td key={yr} className="p-2.5 text-right font-mono">
                                                        {cpc.resultat_net?.[yr] ?? 0}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* SECTION 5 : IMPACTS SOCIO-ÉCONOMIQUES */}
                        {activeSection === "IMPACTS" && (
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                                        Synthese des Emplois & Rôle Économique
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Emplois Directs à Créer</label>
                                            <input
                                                type="number"
                                                value={impacts.emplois_directs ?? 0}
                                                onChange={(e) => updatePath(["impacts_socio_economiques", "emplois_directs"], parseInt(e.target.value, 10) || 0)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Emplois Indirects Générés</label>
                                            <input
                                                type="number"
                                                value={impacts.emplois_indirects ?? 0}
                                                onChange={(e) => updatePath(["impacts_socio_economiques", "emplois_indirects"], parseInt(e.target.value, 10) || 0)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none font-mono"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Rôle Régional & Développement Local</label>
                                            <input
                                                type="text"
                                                value={impacts.role_regional || ""}
                                                onChange={(e) => updatePath(["impacts_socio_economiques", "role_regional"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Impact sur la Balance Commerciale</label>
                                            <input
                                                type="text"
                                                value={impacts.role_balance_commerciale || ""}
                                                onChange={(e) => updatePath(["impacts_socio_economiques", "role_balance_commerciale"], e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-1 focus:ring-slate-600 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                                        Matrice Pluriannuelle des Impacts & Effectifs (2026-2031)
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left border-collapse">
                                            <thead className="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold uppercase text-[10px]">
                                                <tr>
                                                    <th className="p-2 min-w-[150px]">Indicateur</th>
                                                    {yearsCPC.map((yr) => (
                                                        <th key={yr} className="p-2 text-center">{yr}</th>
                                                    ))}
                                                    <th className="p-2 text-right bg-slate-200 text-slate-900">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {["ca_global", "ca_lie", "va_globale", "va_liee", "directs", "indirects"].map((rowKey) => (
                                                    <tr key={rowKey}>
                                                        <td className="p-2 font-medium capitalize text-gray-700">{rowKey.replace("_", " ")}</td>
                                                        {yearsCPC.map((yr) => (
                                                            <td key={yr} className="p-1">
                                                                <input
                                                                    type="number"
                                                                    value={impacts[rowKey]?.[yr] ?? 0}
                                                                    onChange={(e) => updatePath(["impacts_socio_economiques", rowKey, yr], parseFloat(e.target.value) || 0)}
                                                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs text-right font-mono focus:ring-1 focus:ring-slate-500 outline-none"
                                                                />
                                                            </td>
                                                        ))}
                                                        <td className="p-2 text-right font-mono font-bold bg-slate-100 text-slate-900">
                                                            {impacts[rowKey]?.total ?? 0}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-slate-700 text-white font-bold">
                                                    <td className="p-2 uppercase">EFFECTIF CUMULÉ</td>
                                                    {yearsCPC.map((yr) => (
                                                        <td key={yr} className="p-2 text-right font-mono">
                                                            {impacts.effectif_cumule?.[yr] ?? 0}
                                                        </td>
                                                    ))}
                                                    <td className="p-2 text-right font-mono bg-slate-900 text-emerald-400">
                                                        {impacts.effectif_cumule?.total ?? 0}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DossierDataFormEditor;

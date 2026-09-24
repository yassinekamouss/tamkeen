import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import type { StepperFormValues } from "./useStepperMath";
import { useStepperMath, formatMAD, formatPercent } from "./useStepperMath";
import {
  REGIONS_ET_PROVINCES,
  getProvincesForRegion,
  getProvinceDetails,
  getSectorDetails,
  getRegionLabel,
  getProvinceLabel,
  getSectorLabel,
  getBankLabel,
  getProfilRampLabel,
  BANQUES_PARTENAIRES,
  PROFILS_MONTEE_CHARGE,
} from "./referentiels";
import {
  FileCheck2,
  UploadCloud,
  FileText,
  Trash2,
  Sparkles,
  Building2,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface Step5SummaryUploadProps {
  values: StepperFormValues;
  fileFiscale: File | null;
  setFileFiscale: (f: File | null) => void;
  fileRC: File | null;
  setFileRC: (f: File | null) => void;
  fileCNSS: File | null;
  setFileCNSS: (f: File | null) => void;
  errors?: Record<string, string>;
}

export const Step5SummaryUpload: React.FC<Step5SummaryUploadProps> = ({
  values,
  fileFiscale,
  setFileFiscale,
  fileRC,
  setFileRC,
  fileCNSS,
  setFileCNSS,
  errors = {},
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const math = useStepperMath(values);
  const zoneInfo = getProvinceDetails(values.region_id, values.province_id);
  const sectorInfo = getSectorDetails(values.secteur_activite);
  const bankInfo = BANQUES_PARTENAIRES.find((b) => b.code === values.banque_partenaire);
  const profilRamp = PROFILS_MONTEE_CHARGE.find((p) => p.id === values.profil_montee_charge);

  const regObj = REGIONS_ET_PROVINCES.find((r) => r.id === values.region_id);
  const provList = getProvincesForRegion(values.region_id);
  const provObj = provList.find((p) => p.id === values.province_id);

  const regionDisplay = regObj ? getRegionLabel(regObj, lang) : values.region_id;
  const provinceDisplay = provObj ? getProvinceLabel(provObj, lang) : values.province_id;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " o";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
    return (bytes / (1024 * 1024)).toFixed(2) + " Mo";
  };

  const renderUploadBox = (
    label: string,
    description: string,
    file: File | null,
    onSetFile: (f: File | null) => void,
    errorKey: string
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const dropped = e.dataTransfer.files[0];
        if (dropped.type === "application/pdf" || dropped.name.endsWith(".pdf")) {
          onSetFile(dropped);
        }
      }
    };

    return (
      <div className="p-4 bg-white border rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
              {label}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
            {t("stepper.step5.requiredPdfBadge", "Obligatoire (PDF)")}
          </span>
        </div>
        <p className="text-xs text-gray-500">{description}</p>

        {file ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="text-xs font-bold text-emerald-900 block truncate">
                  {file.name}
                </span>
                <span className="text-[10px] text-emerald-700">
                  {formatFileSize(file.size)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSetFile(null)}
              className="p-1.5 hover:bg-emerald-100 rounded-md text-emerald-800 transition-colors"
              title={t("stepper.step5.removeFileTitle", "Supprimer ce fichier")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all hover:bg-blue-50/50 hover:border-blue-400 ${
              errors[errorKey]
                ? "border-red-400 bg-red-50/40"
                : "border-gray-300 bg-gray-50/60"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) onSetFile(e.target.files[0]);
              }}
            />
            <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
            <span className="text-xs font-semibold text-blue-600 block">
              {t("stepper.step5.clickOrDrag", "Cliquez pour téléverser ou glissez votre fichier ici")}
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">
              {t("stepper.step5.pdfOnlyMax", "Format PDF uniquement · Max 10 Mo")}
            </span>
          </div>
        )}

        {errors[errorKey] && (
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors[errorKey]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-blue-600" />
          <span>{t("stepper.step5.title", "Étape 5 : Synthèse du Dossier & Pièces Justificatives")}</span>
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {t(
            "stepper.step5.desc",
            "Vérifiez l'ensemble des indicateurs calculés et joignez vos 3 attestations réglementaires pour lancer la génération de votre rapport."
          )}
        </p>
      </div>

      {/* Hero Card : Prime & Subvention Estimée */}
      <div className="p-6 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              {t("stepper.step5.heroBadge", "Charte de l'Investissement TPME (Volet 2)")}
            </div>
            <h4 className="text-xl sm:text-2xl font-black">
              {t("stepper.step5.heroTitle", "Montant Estimé de la Subvention d'Investissement")}
            </h4>
          </div>
          <div className="text-left sm:text-right rtl:sm:text-left">
            <span className="text-xs text-blue-200 block font-semibold">
              {t("stepper.step5.heroRate", "Taux Global de Prime")}
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
              {formatPercent(math.tauxGlobal)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 pt-1">
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
            {formatMAD(math.montantSubventionEstimee)}
          </div>
          <span className="text-xs text-blue-200">
            {t("stepper.step5.heroBasis", "Calculé sur une assiette CAPEX HT éligible de")}{" "}
            <strong>{formatMAD(math.totalCapex)}</strong>
          </span>
        </div>

        {/* Détail des composantes de la prime */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10 text-xs">
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-lg">
            <span className="text-blue-200 block text-[11px]">
              {t("stepper.step5.primeTerritoriale", { zone: zoneInfo.zone, defaultValue: `Prime Territoriale (${zoneInfo.zone})` })}
            </span>
            <span className="font-bold text-white font-mono text-sm">
              +{formatPercent(math.tauxTerritoriale)}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-lg">
            <span className="text-blue-200 block text-[11px]">
              {t("stepper.step5.primeSectorielle", "Prime Sectorielle")}
            </span>
            <span className="font-bold text-white font-mono text-sm">
              +{formatPercent(math.tauxSectorielle)} (
              {sectorInfo.isPrioritaire
                ? t("stepper.step5.sectorPriority", "Prioritaire")
                : t("stepper.step5.sectorStandard", "0%")}
              )
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-lg">
            <span className="text-blue-200 block text-[11px]">
              {t("stepper.step5.bonusEco", "Bonus Transition Durable")}
            </span>
            <span className="font-bold text-white font-mono text-sm">
              +{formatPercent(math.bonusEcologique)} (
              {values.is_eco_transition
                ? t("stepper.step5.ecoActivated", "Activé")
                : t("stepper.step5.ecoNotActivated", "0% Non activé")}
              )
            </span>
          </div>
        </div>
      </div>

      {/* Synthèse des données saisies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Localisation & Foncier */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-600" />
            {t("stepper.step5.locationSummaryTitle", "Implantation & Foncier")}
          </span>
          <div className="space-y-1 text-xs text-gray-700">
            <div>
              <strong>{t("stepper.step5.regionLabel", "Région :")}</strong> {regionDisplay}
            </div>
            <div>
              <strong>{t("stepper.step5.provinceLabel", "Province :")}</strong> {provinceDisplay} ({zoneInfo.zone})
            </div>
            <div>
              <strong>{t("stepper.step5.addressLabel", "Adresse :")}</strong>{" "}
              {values.adresse_projet || t("stepper.step5.notSpecified", "Non spécifiée")}
            </div>
            <div>
              <strong>{t("stepper.step5.regimeLabel", "Régime :")}</strong>{" "}
              {values.regime_foncier === "LOCATION"
                ? t("stepper.step5.leaseCommercial", "Bail commercial (Location)")
                : t("stepper.step5.fullOwnership", {
                    tf: values.titre_foncier || t("stepper.step5.tfNotSpecified", "T/F non renseigné"),
                    defaultValue: `Pleine propriété (${values.titre_foncier || "T/F non renseigné"})`,
                  })}
            </div>
          </div>
        </div>

        {/* Ambition & Finance */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            {t("stepper.step5.projectionsSummaryTitle", "Projections & Structure")}
          </span>
          <div className="space-y-1 text-xs text-gray-700">
            <div>
              <strong>{t("stepper.step5.projectLabel", "Projet :")}</strong>{" "}
              {values.nature_projet === "CREATION"
                ? t("stepper.step5.creation", "Création")
                : t("stepper.step5.extension", "Extension")}{" "}
              · {t("stepper.step5.directJobs", { count: values.emplois_directs, defaultValue: `${values.emplois_directs} emplois directs` })}
            </div>
            <div>
              <strong>{t("stepper.step5.sectorLabel", "Secteur :")}</strong> {getSectorLabel(sectorInfo, lang)}
            </div>
            <div>
              <strong>{t("stepper.step5.cruisingCaLabel", "CA croisière :")}</strong>{" "}
              {formatMAD(values.ca_cible_croisiere)} ({profilRamp ? getProfilRampLabel(profilRamp, lang) : ""})
            </div>
            <div>
              <strong>{t("stepper.step5.financingLabel", "Financement :")}</strong>{" "}
              {values.mode_financement === "100_FONDS_PROPRES"
                ? t("stepper.step5.mode100Fp", "100% Fonds Propres")
                : t("stepper.step5.modeMixteSummary", {
                    fp: values.part_fonds_propres,
                    dette: 100 - values.part_fonds_propres,
                    bank: bankInfo ? getBankLabel(bankInfo, lang) : "Banque",
                    defaultValue: `Mixte : ${values.part_fonds_propres}% FP / ${100 - values.part_fonds_propres}% Dette (${bankInfo?.label || "Banque"})`,
                  })}
            </div>
          </div>
        </div>
      </div>

      {/* Section Téléversement des 3 Fichiers Réglementaires */}
      <div className="pt-2 border-t border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>{t("stepper.step5.requiredDocsTitle", "Pièces Justificatives Officielles Requises")}</span>
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {t(
                "stepper.step5.requiredDocsDesc",
                "Ces documents légaux sont indispensables pour l'instruction et la certification de votre dossier par nos experts."
              )}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600">
            {t("stepper.step5.attachedCount", {
              count: [fileFiscale, fileRC, fileCNSS].filter(Boolean).length,
              defaultValue: `${[fileFiscale, fileRC, fileCNSS].filter(Boolean).length} / 3 pièces jointes`,
            })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderUploadBox(
            t("stepper.step5.docFiscaleTitle", "Attestation Fiscale"),
            t("stepper.step5.docFiscaleDesc", "Attestation de régularité fiscale délivrée par la DGI (datant de moins de 3 mois)."),
            fileFiscale,
            setFileFiscale,
            "file_fiscale"
          )}
          {renderUploadBox(
            t("stepper.step5.docRcTitle", "Registre de Commerce (RC)"),
            t("stepper.step5.docRcDesc", "Modèle J récent ou certificat d'immatriculation au Registre du Commerce."),
            fileRC,
            setFileRC,
            "file_rc"
          )}
          {renderUploadBox(
            t("stepper.step5.docCnssTitle", "Attestation CNSS"),
            t("stepper.step5.docCnssDesc", "Attestation d'affiliation ou de régularité délivrée par la CNSS."),
            fileCNSS,
            setFileCNSS,
            "file_cnss"
          )}
        </div>
      </div>
    </div>
  );
};

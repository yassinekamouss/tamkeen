import React, { useState } from "react";
import { useClientAuth } from "../../contexts/ClientAuthContext";
import { Header } from "../../components";
import api from "../../api/axios";
import { UserCircle, Save, Phone, Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const font = {
  display: "font-['Plus_Jakarta_Sans',_sans-serif]",
  body: "font-['Roboto_Flex',_sans-serif]",
  mono: "font-['JetBrains_Mono',_monospace]",
};

type SaveStatus = "idle" | "saving" | "success" | "error";

/**
 * Page "Mon profil" — permet à l'utilisateur de modifier ses informations
 * personnelles. L'email est intentionnellement verrouillé (lecture seule).
 */
const ClientProfile: React.FC = () => {
  const { user, checkAuth } = useClientAuth();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [nom, setNom] = useState(user?.nom ?? "");
  const [prenom, setPrenom] = useState(user?.prenom ?? "");
  const [nomEntreprise, setNomEntreprise] = useState(user?.nomEntreprise ?? "");
  const [sexe, setSexe] = useState(user?.sexe ?? "");
  const [age, setAge] = useState(user?.age?.toString() ?? "");
  const [telephones, setTelephones] = useState<string[]>(
    Array.isArray(user?.telephones) && user.telephones.length > 0
      ? user.telephones
      : [""]
  );

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isPhysique = user?.applicantType === "physique";

  // ─── Téléphones helpers ────────────────────────────────────────
  const handlePhoneChange = (index: number, value: string) => {
    setTelephones((prev) => prev.map((p, i) => (i === index ? value : p)));
  };

  const addPhone = () => {
    if (telephones.length >= 5) return;
    setTelephones((prev) => [...prev, ""]);
  };

  const removePhone = (index: number) => {
    if (telephones.length <= 1) return;
    setTelephones((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    setErrorMsg(null);

    const payload: Record<string, unknown> = {
      telephones: telephones.filter(Boolean),
    };

    if (isPhysique) {
      payload.nom = nom.trim();
      payload.prenom = prenom.trim();
      payload.sexe = sexe;
      if (age) payload.age = parseInt(age, 10);
    } else {
      payload.nomEntreprise = nomEntreprise.trim();
    }

    try {
      await api.put("/client-auth/me", payload);
      // Re-fetch auth context so navbar & dashboard reflect the new data
      await checkAuth();
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Une erreur est survenue. Veuillez réessayer.";
      setErrorMsg(msg);
      setSaveStatus("error");
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 text-[14px] text-[#191C1D] bg-white border border-[#DADCE0] rounded focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] transition-colors placeholder:text-[#ABABAB]";
  const disabledInputClass =
    "w-full px-3 py-2.5 text-[14px] text-[#727785] bg-[#F8F9FA] border border-[#DADCE0] rounded cursor-not-allowed select-none";
  const labelClass = `block text-[12px] font-bold text-[#414754] uppercase tracking-wide mb-1.5 ${font.display}`;

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F8F9FA] ${font.body}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Header />

      <main className="flex-grow max-w-[960px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page header */}
        <div className="bg-white rounded border border-[#DADCE0] px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-[#F1F3F4] flex items-center justify-center shrink-0">
            <UserCircle size={20} className="text-[#414754]" />
          </div>
          <div>
            <h1 className={`${font.display} text-[18px] font-bold text-[#191C1D]`}>
              Mon profil
            </h1>
            <p className="text-[13px] text-[#5F6368] mt-0.5">
              Gérez vos informations personnelles. L'email ne peut pas être modifié.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Informations du compte ─────────────────────────── */}
          <section className="bg-white rounded border border-[#DADCE0] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#DADCE0] bg-[#F8F9FA]">
              <h2 className={`${font.display} text-[14px] font-bold text-[#191C1D]`}>
                Informations du compte
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Email — verrouillé */}
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Adresse email
                  <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F3F4] text-[#727785] normal-case tracking-normal">
                    Non modifiable
                  </span>
                </label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  disabled
                  className={disabledInputClass}
                />
              </div>

              {/* Type de profil — info */}
              <div className="sm:col-span-2">
                <label className={labelClass}>Type de profil</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F8F9FA] border border-[#DADCE0] rounded">
                  <span className="text-[13px] text-[#414754] font-medium">
                    {user?.applicantType === "morale" ? "Personne Morale" : "Personne Physique"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Informations personnelles ──────────────────────── */}
          <section className="bg-white rounded border border-[#DADCE0] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#DADCE0] bg-[#F8F9FA]">
              <h2 className={`${font.display} text-[14px] font-bold text-[#191C1D]`}>
                {isPhysique ? "Informations personnelles" : "Informations de l'entreprise"}
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {isPhysique ? (
                <>
                  <div>
                    <label className={labelClass}>Nom</label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Votre nom"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Prénom</label>
                    <input
                      type="text"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      placeholder="Votre prénom"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Sexe</label>
                    <select
                      value={sexe}
                      onChange={(e) => setSexe(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">— Sélectionner —</option>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Âge</label>
                    <input
                      type="number"
                      min={18}
                      max={99}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Votre âge"
                      className={inputClass}
                    />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2">
                  <label className={labelClass}>Nom de l'entreprise</label>
                  <input
                    type="text"
                    value={nomEntreprise}
                    onChange={(e) => setNomEntreprise(e.target.value)}
                    placeholder="Raison sociale"
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          </section>

          {/* ── Numéros de téléphone ───────────────────────────── */}
          <section className="bg-white rounded border border-[#DADCE0] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#DADCE0] bg-[#F8F9FA] flex items-center justify-between">
              <h2 className={`${font.display} text-[14px] font-bold text-[#191C1D]`}>
                Numéros de téléphone
              </h2>
              {telephones.length < 5 && (
                <button
                  type="button"
                  onClick={addPhone}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1A73E8] hover:text-[#174EA6] transition-colors"
                >
                  <Plus size={14} />
                  Ajouter
                </button>
              )}
            </div>
            <div className="p-6 space-y-3">
              {telephones.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Phone
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#727785] pointer-events-none"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      placeholder="+212 6XX XXX XXX"
                      className={`${inputClass} pl-9 ${font.mono}`}
                    />
                  </div>
                  {telephones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhone(index)}
                      className="p-2 text-[#727785] hover:text-[#BA1A1A] hover:bg-[#FFDAD6] rounded transition-colors"
                      aria-label="Supprimer ce numéro"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Feedback & Submit ─────────────────────────────── */}
          {saveStatus === "error" && errorMsg && (
            <div className="flex items-start gap-3 px-5 py-4 bg-[#FFDAD6] border-l-4 border-[#BA1A1A] rounded text-[#93000A] text-[13px]">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {saveStatus === "success" && (
            <div className="flex items-center gap-3 px-5 py-4 bg-[#E6F4EA] border-l-4 border-[#1E8E3E] rounded text-[#1E8E3E] text-[13px] font-medium">
              <CheckCircle2 size={16} className="shrink-0" />
              Profil mis à jour avec succès.
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saveStatus === "saving"}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1A73E8] hover:bg-[#174EA6] text-white text-[13px] font-bold rounded shadow-[0_2px_8px_rgba(26,115,232,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {saveStatus === "saving" ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enregistrement…
                </>
              ) : (
                <>
                  <Save size={15} />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ClientProfile;

import React from "react";
import { useTranslation } from "react-i18next";

export type ProfileType = "morale" | "physique";

interface ProfileSelectorProps {
  selectedProfile: ProfileType | null;
  onSelectProfile: (profile: ProfileType) => void;
}

const ACCENT = "#2563EB"; // bleu institutionnel
const INK = "#14202B";
const LINE = "#E2E6E8";

const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  selectedProfile,
  onSelectProfile,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";
  const isRTL = lang === "ar";

  const options: {
    id: ProfileType;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "morale",
      title: t("profile_selector.morale_title", {
        defaultValue: "Personne Morale",
      }),
      subtitle: t("profile_selector.morale_subtitle", {
        defaultValue: "Entreprises, associations, coopératives",
      }),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.6}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4"
          />
        </svg>
      ),
    },
    {
      id: "physique",
      title: t("profile_selector.physique_title", {
        defaultValue: "Personne Physique",
      }),
      subtitle: t("profile_selector.physique_subtitle", {
        defaultValue: "Auto-entrepreneurs, particuliers",
      }),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.6}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="relative z-20 max-w-4xl mx-auto -mt-32 bg-white border shadow-sm overflow-hidden"
      style={{ borderColor: LINE }}
    >
      {/* En-tête */}
      <div
        className="px-6 md:px-10 pt-7 pb-5 border-b"
        style={{ borderColor: LINE }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-[11px] font-semibold tracking-[0.16em]"
            style={{ color: ACCENT }}
          >
            {t("profile_selector.eyebrow_number", {
              defaultValue: "ÉTAPE 1",
            })}
          </span>

          <span
            className="h-px flex-1"
            style={{ backgroundColor: LINE }}
          />

          <span className="text-[11px] font-medium tracking-[0.12em] text-gray-400 uppercase">
            {t("profile_selector.eyebrow", {
              defaultValue: "Sélection du profil",
            })}
          </span>
        </div>

        <h2
          className="text-[1.5rem] leading-tight font-semibold"
          style={{ color: INK }}
        >
          {t("profile_selector.title", {
            defaultValue: "Sélectionnez votre structure",
          })}
        </h2>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {options.map((option, idx) => {
          const isSelected = selectedProfile === option.id;
          const isFirst = idx === 0;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectProfile(option.id)}
              aria-pressed={isSelected}
              className={`relative flex items-start gap-4 text-start p-6 md:p-8 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isFirst ? "border-b md:border-b-0" : ""
              } ${isSelected ? "" : "hover:bg-gray-50"}`}
              style={{
                borderColor: LINE,
                backgroundColor: isSelected ? "#EFF6FF" : "transparent",
              }}
            >
              {/* Liseré latéral */}
              <span
                className={`absolute inset-y-0 ${
                  isRTL ? "right-0" : "left-0"
                } w-[3px]`}
                style={{
                  backgroundColor: isSelected ? ACCENT : "transparent",
                }}
              />

              {/* Icône */}
              <div
                className="mt-0.5 shrink-0"
                style={{
                  color: isSelected ? ACCENT : "#6B7680",
                }}
              >
                {option.icon}
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="text-base font-semibold"
                    style={{ color: INK }}
                  >
                    {option.title}
                  </span>

                  {/* Indicateur de sélection */}
                  <span
                    className="shrink-0 border-2 flex items-center justify-center"
                    style={{
                      width: 18,
                      height: 18,
                      borderColor: isSelected ? ACCENT : "#C7CDD1",
                    }}
                  >
                    {isSelected && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          backgroundColor: ACCENT,
                        }}
                      />
                    )}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {option.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSelector;
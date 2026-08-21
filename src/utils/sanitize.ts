/**
 * Helper utility to sanitize and correct common French database encoding
 * issues where accented characters were stripped or corrupted.
 */
export const sanitizeFrenchText = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/\bpremire\b/g, "première")
    .replace(/\bPremire\b/g, "Première")
    .replace(/\bactivit\b/g, "activité")
    .replace(/\bActivit\b/g, "Activité")
    .replace(/\bactivits\b/g, "activités")
    .replace(/\bActivits\b/g, "Activités")
    .replace(/\bcologique\b/g, "écologique")
    .replace(/\bCologique\b/g, "Écologique")
    .replace(/\bcologiques\b/g, "écologiques")
    .replace(/\bCologiques\b/g, "Écologiques")
    .replace(/\bl'quipement\b/g, "l'équipement")
    .replace(/\bL'quipement\b/g, "L'équipement")
    .replace(/\bquipement\b/g, "équipement")
    .replace(/\bQuipement\b/g, "Équipement")
    .replace(/\bquipements\b/g, "équipements")
    .replace(/\bQuipements\b/g, "Équipements")
    .replace(/\bRgionale\b/g, "Régionale")
    .replace(/\brgionale\b/g, "régionale")
    .replace(/\bRgionales\b/g, "Régionales")
    .replace(/\brgionales\b/g, "régionales")
    .replace(/\bconomique\b/g, "économique")
    .replace(/\bConomique\b/g, "Économique")
    .replace(/\bconomiques\b/g, "économiques")
    .replace(/\bConomiques\b/g, "Économiques")
    .replace(/\bExpir\b/g, "Expiré")
    .replace(/\bexpir\b/g, "expiré")
    .replace(/\bligibilit\b/g, "éligibilité")
    .replace(/\bLigibilit\b/g, "Éligibilité")
    .replace(/\bligible\b/g, "éligible")
    .replace(/\bLigible\b/g, "Éligible");
};

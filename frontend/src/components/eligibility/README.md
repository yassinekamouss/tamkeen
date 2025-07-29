# Architecture du Formulaire d'Éligibilité

## Vue d'ensemble

Le composant `EligibilityForm` a été refactorisé en une architecture modulaire et maintenable, séparant les responsabilités et améliorant la réutilisabilité du code.

## Structure des dossiers

```
src/components/eligibility/
├── types.ts                    # Types et interfaces TypeScript
├── constants.ts               # Constantes et données de référence
├── utils.ts                   # Logique métier et calculs
├── validation.ts              # Logique de validation des formulaires
├── ApplicantTypeSelector.tsx  # Sélection type de demandeur
├── PersonnePhysiqueForm.tsx   # Formulaire personne physique
├── PersonneMoraleForm.tsx     # Formulaire personne morale
├── CommonFields.tsx           # Champs communs aux deux types
├── EligibilityResult.tsx      # Affichage des résultats
├── EligibilityFormNew.tsx     # Composant principal refactorisé
├── index.ts                   # Exports centralisés
└── README.md                  # Cette documentation
```

## Composants

### 1. **ApplicantTypeSelector**

- **Responsabilité** : Sélection du type de demandeur (physique/morale)
- **Props** : `formData`, `setFormData`, `error`
- **Fonctionnalités** : Cartes interactives avec icônes et animations

### 2. **PersonnePhysiqueForm**

- **Responsabilité** : Formulaire spécifique aux personnes physiques
- **Props** : `formData`, `errors`, `onInputChange`
- **Champs** : Nom, prénom, email, téléphone, secteur, région, statut juridique, année

### 3. **PersonneMoraleForm**

- **Responsabilité** : Formulaire spécifique aux personnes morales
- **Props** : `formData`, `errors`, `onInputChange`
- **Champs** : Nom entreprise, email, secteur d'activité, région, statut juridique, année

### 4. **CommonFields**

- **Responsabilité** : Champs communs aux deux types de demandeurs
- **Props** : `formData`, `errors`, `onInputChange`, `onCheckboxChange`
- **Champs** : Chiffres d'affaires, montant investissement, politique de confidentialité

### 5. **EligibilityResult**

- **Responsabilité** : Affichage des résultats d'éligibilité
- **Props** : `isEligible`, `eligibleProgram`, `formData`, `onNewTest`
- **Fonctionnalités** : Design différencié selon le résultat (succès/échec)

### 6. **EligibilityFormNew** (Composant principal)

- **Responsabilité** : Orchestration de tous les sous-composants
- **Props** : `onNavigateBack`
- **Fonctionnalités** : Gestion d'état, validation, soumission

## Fichiers utilitaires

### **types.ts**

- Interfaces TypeScript pour `FormData`, `FormErrors`, `EligibilityResult`
- Props des composants

### **constants.ts**

- Listes des secteurs, régions, statuts juridiques
- Options de montant d'investissement
- Années de création

### **utils.ts**

- `getYearsForCA()` : Calcul des années de chiffres d'affaires
- `checkEligibility()` : Logique d'éligibilité pour tous les programmes

### **validation.ts**

- `validateEligibilityForm()` : Validation complète du formulaire
- Gestion des erreurs par type de demandeur

## Avantages de cette architecture

### ✅ **Séparation des responsabilités**

- Chaque composant a une responsabilité unique et claire
- Facilite les tests unitaires et la maintenance

### ✅ **Réutilisabilité**

- Composants modulaires réutilisables dans d'autres parties de l'app
- Logique métier centralisée dans les utilitaires

### ✅ **Maintenabilité**

- Code plus lisible et organisé
- Modifications localisées sans impact sur le reste

### ✅ **Évolutivité**

- Facile d'ajouter de nouveaux types de demandeurs
- Architecture prête pour de nouveaux programmes d'éligibilité

### ✅ **Performance**

- Components plus petits = re-renders optimisés
- Lazy loading possible pour certains composants

## Migration

### Ancien fichier

```tsx
// Ancien fichier monolithique (1281 lignes)
import { EligibilityForm } from "./EligibilityForm";
```

### Nouveau fichier

```tsx
// Nouvelle architecture modulaire
import { EligibilityForm } from "./eligibility";
```

## Usage

```tsx
import { EligibilityForm } from "@/components/eligibility";

function App() {
  return (
    <EligibilityForm onNavigateBack={() => console.log("Navigate back")} />
  );
}
```

## Conditions d'éligibilité

### **Go Siyaha** (Programme prioritaire)

- ✅ Secteur : "ActiviteTouristique"
- ✅ Statut juridique : SARL, SARLU, SAS, personne physique patentée, etc.
- ✅ Montant d'investissement : Requis

### **La Charte TPME**

- ✅ Type : Personne morale uniquement
- ✅ CA : 1M-200M MAD sur une des 3 dernières années
- ✅ Investissement : 1M-50M MAD

## Développement

### Ajouter un nouveau programme

1. Modifier `checkEligibility()` dans `utils.ts`
2. Ajouter les constantes nécessaires dans `constants.ts`
3. Mettre à jour la validation si nécessaire

### Ajouter un nouveau type de demandeur

1. Créer un nouveau composant de formulaire
2. Étendre les types dans `types.ts`
3. Modifier `ApplicantTypeSelector` et le composant principal

### Tests

- Chaque composant peut être testé individuellement
- Logique métier séparée facilite les tests unitaires
- Validation centralisée pour tests de régression

## Performance

- **Avant** : 1 composant de 1281 lignes
- **Après** : 9 fichiers modulaires (moyenne 100 lignes)
- **Chargement** : Plus rapide grâce à la modularité
- **Re-renders** : Optimisés par composant

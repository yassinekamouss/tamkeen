# React + TypeScript + Vite

## Chatbot integration

Le chatbot utilise désormais l'API backend sécurisée au lieu d'appeler OpenAI depuis le front.

- Endpoint: http://localhost:5000/api/chat
- Aucune clé OpenAI ne doit être présente dans les variables Vite (`VITE_OPENAI_API_KEY` à supprimer de vos fichiers .env et de l'hébergement).

# Tamkeen - Centre d'Empowerment

> **Application web moderne pour l'autonomisation des individus grâce à des opportunités de formation et d'emploi.**

---

## Table des matières

- [À propos du projet](#à-propos-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Démarrage rapide](#démarrage-rapide)
- [Structure du projet](#structure-du-projet)
- [Configuration](#configuration)
- [Responsive Design](#responsive-design)
- [Internationalisation](#internationalisation)
- [Guide de style](#guide-de-style)
- [Performance](#performance)
- [Sécurité](#sécurité)
- [Déploiement](#déploiement)
- [Contribution](#contribution)
- [Debugging](#debugging)

---

## À propos du projet

**Tamkeen** est une plateforme web dédiée à l'autonomisation des individus et des entreprises à travers des programmes de financement et d'accompagnement. L'application offre un système d'évaluation d'éligibilité intelligent pour orienter les utilisateurs vers les programmes adaptés à leur profil.

### Objectifs

- **Simplifier** l'accès aux programmes de financement
- **Optimiser** le processus d'évaluation d'éligibilité
- **Accompagner** les porteurs de projets dans leur démarche
- **Centraliser** les informations et ressources

---

## Fonctionnalités

### Actuelles

- **Site Web Multi-pages** - Navigation fluide entre accueil, à propos, FAQ, politique de confidentialité
- **Formulaire d'Éligibilité Intelligent** - Évaluation automatique pour Go Siyaha et La Charte TPME
- **Architecture Modulaire** - Composants réutilisables et maintenables
- **Chatbot Interactif** - Assistance automatisée pour les utilisateurs
- **Design Responsive** - Optimisé pour mobile, tablette et desktop
- **Support Multilingue** - Français et Arabe (i18next)
- **Validation Avancée** - Validation côté client avec feedback en temps réel
- **Interface Moderne** - Design Material UI avec animations

### En cours de développement

- **Système d'Authentification** - Connexion utilisateur sécurisée
- **Tableau de Bord** - Suivi des candidatures et statuts
- **Notifications** - Alertes en temps réel
- **Export PDF** - Génération de rapports d'éligibilité

### Roadmap future

- **Application Mobile** - Version native iOS/Android
- **IA Conversationnelle** - Chatbot intelligent avec NLP
- **Analytics** - Tableaux de bord administrateur
- **Intégrations API** - Connexions avec systèmes externes
- **Email Marketing** - Campagnes automatisées
- **Centre de Formation** - Modules d'apprentissage en ligne

---

## Architecture

### Principes architecturaux

- **Modulaire** : Composants indépendants et réutilisables
- **Scalable** : Architecture prête pour la montée en charge
- **Maintenable** : Code lisible et bien documenté
- **Testable** : Séparation des responsabilités

### Patterns utilisés

- **Composition over Inheritance** : Composants composables
- **Container/Presentational** : Séparation logique/affichage
- **Custom Hooks** : Logique réutilisable
- **Atomic Design** : Composants atomiques, molécules, organismes

---

## Technologies

### Frontend

| Technologie       | Version | Usage                     |
| ----------------- | ------- | ------------------------- |
| **React**         | ^18.2.0 | Bibliothèque UI           |
| **TypeScript**    | ^5.0.2  | Typage statique           |
| **Vite**          | ^4.4.5  | Build tool et serveur dev |
| **Tailwind CSS**  | ^3.3.0  | Framework CSS utilitaire  |
| **React Router**  | ^6.15.0 | Routing côté client       |
| **React i18next** | ^13.2.2 | Internationalisation      |

### Outils de développement

- **ESLint** - Linting et qualité du code
- **Prettier** - Formatage automatique
- **Husky** - Git hooks
- **lint-staged** - Linting pre-commit

### Dépendances principales

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.15.0",
  "react-i18next": "^13.2.2",
  "i18next": "^23.4.4"
}
```

---

## Démarrage rapide

### Prérequis

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 ou **yarn** >= 1.22.0
- **Git** pour le versioning

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/yassinekamouss/tamkeen.git
cd tamkeen

# 2. Installer les dépendances
npm install

# 3. Copier les variables d'environnement
cp .env.example .env.local

# 4. Démarrer en mode développement
npm run dev

# 5. Ouvrir dans le navigateur
# http://localhost:5173
```

### Scripts disponibles

```bash
# Développement
npm run dev          # Serveur de développement

# Build et production
npm run build        # Build de production
npm run preview      # Prévisualiser le build

# Qualité du code
npm run lint         # Vérifier avec ESLint
```

---

## Structure du projet

```
tamkeen/
├── public/                          # Assets statiques
│   ├── logo.png                        # Logo principal
│   ├── favicon.ico                     # Favicon
│   └── locales/                        # Fichiers de traduction
├── src/
│   ├── components/                  # Composants réutilisables
│   │   ├── eligibility/             # Module d'éligibilité
│   │   │   ├── types.ts                # Types TypeScript
│   │   │   ├── constants.ts            # Constantes et données
│   │   │   ├── utils.ts                # Logique métier
│   │   │   ├── validation.ts           # Validation formulaires
│   │   │   ├── ApplicantTypeSelector.tsx
│   │   │   ├── PersonnePhysiqueForm.tsx
│   │   │   ├── PersonneMoraleForm.tsx
│   │   │   ├── CommonFields.tsx
│   │   │   ├── EligibilityResult.tsx
│   │   │   ├── EligibilityFormNew.tsx  # Composant principal
│   │   │   ├── index.ts                # Exports centralisés
│   │   │   └── README.md               # Documentation module
│   │   ├── Header.tsx                  # En-tête navigation
│   │   ├── Footer.tsx                  # Pied de page
│   │   ├── Hero.tsx                    # Section héro
│   │   ├── Chatbot.tsx                 # Assistant virtuel
│   │   └── index.ts                    # Exports des composants
│   ├── pages/                       # Pages de l'application
│   │   ├── Home.tsx                    # Page d'accueil
│   │   ├── About.tsx                   # À propos
│   │   ├── FAQ.tsx                     # Questions fréquentes
│   │   ├── Privacy.tsx                 # Politique de confidentialité
│   │   └── index.ts                    # Exports des pages
│   ├── assets/                      # Ressources média
│   │   ├── images/                     # Images
│   │   └── icons/                      # Icônes
│   ├── locales/                     # Traductions
│   │   ├── ar/                         # Arabe
│   │   └── fr/                         # Français
│   ├── hooks/                       # Custom hooks React
│   ├── utils/                       # Utilitaires généraux
│   ├── types/                       # Types TypeScript globaux
│   ├── App.tsx                         # Composant racine
│   ├── main.tsx                        # Point d'entrée
│   ├── index.css                       # Styles globaux
│   └── i18n.ts                         # Configuration i18n
├── docs/                            # Documentation
├── .env.example                     # Variables d'environnement modèle
├── .gitignore                       # Fichiers ignorés Git
├── eslint.config.js                 # Configuration ESLint
├── package.json                     # Dépendances et scripts
├── tailwind.config.js               # Configuration Tailwind
├── tsconfig.json                    # Configuration TypeScript
├── vite.config.ts                   # Configuration Vite
└── README.md                        # Ce fichier
```

---

## Configuration

### Configuration Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        secondary: "#64748B",
        accent: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

---

## Responsive Design

### Breakpoints Tailwind

- **sm**: 640px (mobile large)
- **md**: 768px (tablette)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

### Approche Mobile-First

```tsx
// Exemple de composant responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 sm:p-6 lg:p-8">{/* Contenu adaptatif */}</div>
</div>
```

---

## Internationalisation

### Structure des traductions

```
src/locales/
├── fr/
│   └── translation.json
└── ar/
    └── translation.json
```

### Utilisation dans les composants

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t("welcome.title")}</h1>;
}
```

### Fichier de traduction exemple

```json
{
  "welcome": {
    "title": "Bienvenue chez Tamkeen",
    "subtitle": "Votre partenaire pour l'autonomisation"
  },
  "eligibility": {
    "title": "Test d'éligibilité",
    "form": {
      "name": "Nom complet",
      "email": "Adresse email"
    }
  }
}
```

---

## Guide de style

### Palette de couleurs

```css
:root {
  --color-primary: #1e40af; /* Bleu principal */
  --color-secondary: #64748b; /* Gris secondaire */
  --color-accent: #f59e0b; /* Orange accent */
  --color-success: #10b981; /* Vert succès */
  --color-warning: #f59e0b; /* Orange avertissement */
  --color-danger: #ef4444; /* Rouge erreur */
}
```

### Convention de nommage

- **Composants** : PascalCase (`EligibilityForm`)
- **Fichiers** : PascalCase pour les composants, camelCase pour les utilitaires
- **Variables** : camelCase
- **Constants** : UPPER_SNAKE_CASE
- **Classes CSS** : kebab-case (Tailwind)

### Standards de code

```typescript
// Bon
interface UserProps {
  name: string;
  email: string;
  isActive: boolean;
}

const UserCard: React.FC<UserProps> = ({ name, email, isActive }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{email}</p>
      {isActive && <span className="text-green-500">Actif</span>}
    </div>
  );
};
```

---

## Performance

### Optimisations implémentées

- **Code Splitting** avec React.lazy()
- **Lazy Loading** des images
- **Bundle Analysis** avec Vite
- **Compression** automatique en production
- **Progressive Enhancement**

### Métriques cibles

- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1
- **First Input Delay** : < 100ms

### Monitoring

```bash
# Analyser la taille du bundle
npm run build
npm run analyze

# Audit de performance
npm run lighthouse
```

---

## Sécurité

### Mesures implémentées

- **Content Security Policy** (CSP)
- **HTTPS** obligatoire en production
- **Sanitisation** des inputs utilisateur
- **Validation** côté client et serveur
- **Audit** des dépendances npm

---

## Déploiement

### Environnements

| Environnement   | URL                        | Branch    | Status |
| --------------- | -------------------------- | --------- | ------ |
| **Development** | http://localhost:5173      | `develop` | Active |
| **Staging**     | https://staging.tamkeen.ma | `staging` | Review |
| **Production**  | https://tamkeen.ma         | `main`    | Stable |

### Process de déploiement

```bash
# 1. Build de production
npm run build

# 2. Tests avant déploiement
npm run test:prod

# 3. Vérification de sécurité
npm audit

# 4. Déploiement (exemple avec Vercel)
vercel --prod
```

### Checklist pré-déploiement

- [ ] Tests passent
- [ ] Build sans erreurs
- [ ] Performance optimisée
- [ ] Sécurité auditée
- [ ] Documentation à jour

---

## Contribution

### Workflow Git

```bash
# 1. Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# 2. Développer et commiter
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"

# 3. Pousser et créer PR
git push origin feature/nouvelle-fonctionnalite
```

### Convention des commits

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: mise à jour documentation
style: formatage du code
refactor: refactorisation
test: ajout de tests
chore: maintenance
```

### Code Review Checklist

- [ ] Code lisible et documenté
- [ ] Tests unitaires ajoutés
- [ ] Performance optimisée
- [ ] Accessibilité respectée
- [ ] Responsive design vérifié
- [ ] i18n ajouté si nécessaire

---

## Debugging

### Outils de debug

- **React DevTools** - Extension navigateur
- **Redux DevTools** - Si Redux utilisé
- **Vite DevTools** - Debugging Vite
- **Browser DevTools** - Console, Network, Performance

### Logs de debug

```typescript
// En développement uniquement
if (import.meta.env.DEV) {
  console.log("Debug info:", data);
}
```

### Issues communes

| Problème                 | Solution                               |
| ------------------------ | -------------------------------------- |
| Port 5173 occupé         | Changer le port dans `vite.config.ts`  |
| Erreurs TypeScript       | Vérifier `tsconfig.json`               |
| Hot reload ne marche pas | Redémarrer `npm run dev`               |
| Build échoue             | Vérifier les variables d'environnement |

---

## Remerciements

- **React Team** pour l'excellente bibliothèque
- **Vite Team** pour l'outil de build rapide
- **Tailwind CSS** pour le framework CSS
- **Vercel** pour l'hébergement
- **Communauté Open Source** pour les contributions

---

<div align="center">
  <p>Fait avec passion par l'équipe Tamkeen</p>
  <p>
    <a href="https://tamkeen.ma">Site Web</a> •
    <a href="mailto:contact@tamkeen.ma">Contact</a> •
    <a href="https://github.com/yassinekamouss/tamkeen">GitHub</a>
  </p>
</div>

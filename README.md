# Tamkeen - Centre d'Empowerment

Ce projet est une application web pour Tamkeen, une organisation dédiée à l'autonomisation des individus grâce à des opportunités de formation et d'emploi. L'application est construite avec React, TypeScript, et Vite, et utilise Tailwind CSS pour le style.

## ✨ Fonctionnalités

### Actuelles
- **Site Web Multi-pages :** Comprend des pages d'accueil, À propos, FAQ, et Politique de confidentialité.
- **Formulaire d'Éligibilité :** Un formulaire interactif pour que les utilisateurs puissent vérifier leur éligibilité aux programmes.
- **Chatbot :** Un chatbot pour l'assistance et l'engagement des utilisateurs.
- **Design Responsive :** Assure une expérience utilisateur transparente sur tous les appareils.

### Prévues
- **Support Bilingue :** Support complet pour l'anglais et le français.
- **Système d'Authentification :** Connexion et inscription des utilisateurs pour un contenu personnalisé.
- **Tableau de Bord Utilisateur :** Une fois connectés, les utilisateurs peuvent suivre la progression de leurs candidatures et de leurs formations.
- **Listes de Programmes :** Pages détaillées pour chaque programme de formation offert.
- **Intégration d'un Blog :** Pour partager des actualités, des histoires de réussite et des articles pertinents.

## 🚀 Technologies Utilisées

- **Frontend :** React, TypeScript, Vite
- **Style :** Tailwind CSS
- **Routing :** React Router
- **Outils de Développement :** ESLint, Prettier

## 📦 Démarrage

Pour faire fonctionner ce projet localement, suivez ces étapes :

1. **Clonez le dépôt :**
   ```bash
   git clone https://github.com/votre-nom-utilisateur/tamkeen.git
   ```
2. **Naviguez vers le répertoire du projet :**
   ```bash
   cd tamkeen
   ```
3. **Installez les dépendances :**
   ```bash
   npm install
   ```
4. **Démarrez le serveur de développement :**
   ```bash
   npm run dev
   ```
5. **Ouvrez votre navigateur** et visitez `http://localhost:5173`.

## 📂 Structure du Projet

```
tamkeen/
├── public/
│   └── logo.png
├── src/
│   ├── assets/
│   │   ├── image_logo.png
│   │   ├── image1.png
│   │   ├── image2.png
│   │   ├── image3.png
│   │   └── logo.png
│   ├── components/
│   │   ├── Chatbot.tsx
│   │   ├── EligibilityForm.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── index.ts
│   │   └── PrivacyModalNew.tsx
│   ├── pages/
│   │   ├── About.tsx
│   │   ├── FAQ.tsx
│   │   ├── Home.tsx
│   │   ├── index.ts
│   │   └── Privacy.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.ts
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez forker le dépôt et créer une pull request avec vos changements. Pour les changements majeurs, veuillez ouvrir une issue au préalable pour discuter de ce que vous aimeriez changer.

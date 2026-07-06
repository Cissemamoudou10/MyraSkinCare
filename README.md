# Myra Skin Care

Site vitrine + espace d'administration pour la boutique de cosmétiques coréens (K-Beauty) **Myra Skin Care**, Bamako (Mali).

> « La beauté coréenne au service de votre éclat naturel. »

## Stack technique

- **React 18** + **Vite** (JavaScript / JSX)
- **React Router** pour la navigation (front + admin)
- **CSS Modules** pour le style (scopé par composant)
- Design tokens centralisés (couleurs, polices) dans `src/styles/global.css`

## Démarrage

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production (dossier dist/)
npm run preview  # prévisualiser le build
```

- Le **site vitrine** est sur `/`
- L'**espace admin** est sur `/admin`

## Structure du projet

```
src/
├── assets/              Images du projet (logo…)
├── styles/
│   └── global.css       ★ Design tokens (couleurs, polices) + styles de base
├── lib/
│   ├── tokens.js        Tokens en JS (pour styles dynamiques)
│   └── useReveal.js     Hook d'animation au scroll
├── data/                ★ Données (à remplacer par l'API)
│   ├── navigation.js    Menu + banderole
│   └── products.js      Produits, avis, articles, marques
├── components/
│   ├── ui/              Composants réutilisables (Button, ProductCard, icônes…)
│   ├── layout/          Header, Footer, SidePanel, Marquee, NavItem, SiteLayout
│   └── sections/        Hero + sections de la page d'accueil
├── pages/               Pages du site vitrine (Accueil, Boutique…)
├── admin/               Espace d'administration
│   ├── AdminLayout.jsx  Mise en page admin (sidebar)
│   └── pages/           Tableau de bord, Produits, Formulaire produit, Commandes
├── App.jsx              ★ Routeur (routes front + admin)
└── main.jsx             Point d'entrée
```

★ = les endroits les plus utiles à connaître pour modifier le site.

## Personnaliser

- **Couleurs & polices** : `src/styles/global.css` (variables `--color-*`, `--font-*`).
- **Menu de navigation** : `src/data/navigation.js`.
- **Produits & contenus** : `src/data/products.js`.
- **Logo** : remplacer `src/assets/logo-myra.png`.
- **Favicon** : remplacer les fichiers dans `public/`.

## Brancher le backend (prochaine étape)

Les données sont isolées dans `src/data/`. Pour connecter une API, il suffira de
remplacer les imports statiques par des appels réseau (fetch / axios) dans les
pages et composants concernés. L'espace admin (`src/admin/`) contient déjà les
écrans de gestion (liste produits, formulaire, commandes) prêts à être reliés
aux endpoints — voir les commentaires `// TODO` dans `ProductForm.jsx`.

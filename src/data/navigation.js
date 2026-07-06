// ============================================================
//  Structure de navigation (menu principal)
//  Les entrées avec `sub` ouvrent un sous-menu ; `feature`
//  ajoute des vignettes illustrées dans le méga-menu.
// ============================================================

export const NAV = [
  { label: "Nouveautés", to: "/boutique?filtre=nouveautes", sub: null },
  {
    label: "Préoccupations",
    to: "/preoccupations",
    sub: [
      { label: "Hydratation & confort", to: "/boutique?probleme=hydratation" },
      { label: "Éclat & teint terne", to: "/boutique?probleme=eclat" },
      { label: "Imperfections & pores", to: "/boutique?probleme=imperfections" },
      { label: "Anti-âge", to: "/boutique?probleme=anti-age" },
      { label: "Sensibilité & rougeurs", to: "/boutique?probleme=rougeurs" },
      { label: "Soin du regard", to: "/boutique?probleme=regard" },
    ],
    feature: [
      { title: "Hydratation & confort", img: "1556228720-195a672e8a03", to: "/boutique?probleme=hydratation" },
      { title: "Éclat & teint terne", img: "1620916566398-39f1143ab7be", to: "/boutique?probleme=eclat" },
    ],
  },
  {
    label: "Visage",
    to: "/boutique?categorie=visage",
    sub: [
      { label: "Nettoyants", to: "/boutique?tag=nettoyant" },
      { label: "Toniques & brumes", to: "/boutique?tag=tonique" },
      { label: "Sérums & ampoules", to: "/boutique?tag=serum" },
      { label: "Crèmes & hydratants", to: "/boutique?tag=creme" },
      { label: "Exfoliants & masques", to: "/boutique?tag=exfoliant" },
      { label: "Protections solaires", to: "/boutique?tag=solaire" },
    ],
    feature: [
      { title: "Sérums & ampoules", img: "1608248543803-ba4f8c70ae0b", to: "/boutique?tag=serum" },
      { title: "Crèmes & hydratants", img: "1571781926291-c477ebfd024b", to: "/boutique?tag=creme" },
    ],
  },
  {
    label: "Marques",
    to: "/marques",
    sub: [
      { label: "Myra", to: "/boutique?marque=myra" },
      { label: "Marques partenaires", to: "/marques" },
      { label: "Best-sellers", to: "/boutique?filtre=populaires" }
    ],
    feature: [
      { title: "La marque Myra", img: "1556228578-8c89e6adf883", to: "/boutique?marque=myra" },
      { title: "Nos partenaires", img: "1570194065650-d99fb4bedf0a", to: "/marques" },
    ],
  },
  { label: "Compléments", to: "/boutique?categorie=complements", sub: null },
  {
    label: "Corps & Cheveux",
    to: "/boutique?categorie=corps-cheveux",
    sub: [
      { label: "Gels & gommages corps", to: "/boutique?tag=gel" },
      { label: "Laits & crèmes corps", to: "/boutique?tag=lait" },
      { label: "Mains & pieds", to: "/boutique?tag=main" },
      { label: "Shampoings & soins", to: "/boutique?tag=shampoing" },
      { label: "Huiles capillaires", to: "/boutique?tag=huile" },
    ],
    feature: [
      { title: "Laits & crèmes corps", img: "1601049541289-9b1b7bbbfe19", to: "/boutique?tag=lait" },
      { title: "Huiles capillaires", img: "1612817288484-6f916006741a", to: "/boutique?tag=huile" },
    ],
  },
  { label: "K-Beauty", to: "/boutique?tag=kbeauty", sub: null },
  { label: "Nos kits", to: "/nos-kits", sub: null },
  { label: "Ingrédients", to: "/ingredients", sub: null },
];

// Ingrédients défilants de la banderole
export const MARQUEE = [
  "Centella",
  "Acide hyaluronique",
  "Niacinamide",
  "Ginseng",
  "Mucine d'escargot",
  "Thé vert",
  "Riz fermenté",
  "Propolis",
  "Rétinol",
  "Vitamine C",
];

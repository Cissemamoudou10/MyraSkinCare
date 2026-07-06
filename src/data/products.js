// ============================================================
//  Données de démonstration
//  À remplacer par des appels API quand le backend sera prêt.
//  La forme des objets correspond aux champs prévus côté admin.
// ============================================================

const U = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

export const PRODUCTS = [
  {
    id: 1,
    name: "Sérum Centella Apaisant",
    type: "Visage",
    concern: "Sensibilité & rougeurs",
    desc: "Sérum concentré aux actifs coréens pour une peau apaisée et lumineuse.",
    price: 29000,
    img: U("1556228720-195a672e8a03"),
    badge: "Best-seller",
  },
  {
    id: 2,
    name: "Crème Riz Fermenté",
    type: "Visage",
    concern: "Éclat & teint terne",
    desc: "Texture fondante nourrissante, éclat et confort immédiat.",
    price: 24000,
    img: U("1601049541289-9b1b7bbbfe19"),
  },
  {
    id: 3,
    name: "Essence Ginseng",
    type: "Visage",
    concern: "Anti-âge",
    desc: "Essence revitalisante, fermeté et lumière jour après jour.",
    price: 25500,
    img: U("1608248543803-ba4f8c70ae0b"),
  },
  {
    id: 4,
    name: "Crème Mucine d'Escargot",
    type: "Visage",
    concern: "Hydratation & confort",
    desc: "Réparation intense, peau rebondie et lissée.",
    price: 14500,
    img: U("1571781926291-c477ebfd024b"),
  },
  {
    id: 5,
    name: "Toner Acide Hyaluronique",
    type: "Visage",
    concern: "Hydratation & confort",
    desc: "Lotion hydratante repulpante, fraîcheur instantanée.",
    price: 21000,
    img: U("1620916566398-39f1143ab7be"),
  },
  {
    id: 6,
    name: "Masque Thé Vert Purifiant",
    type: "Visage",
    concern: "Imperfections & pores",
    desc: "Masque purifiant à l'argile et thé vert, pores resserrés.",
    price: 18500,
    img: U("1612817288484-6f916006741a"),
  },
];

export const NEW_PRODUCTS = [
  { id: "n1", name: "Essence Lumière", type: "Visage", price: 32000, img: U("1556228453-efd6c1ff04f6", 500) },
  { id: "n2", name: "Masque Nuit Réparateur", type: "Visage", price: 27000, img: U("1608248597279-f99d160bfcbc", 500) },
  { id: "n3", name: "Huile Précieuse Corps", type: "Corps", price: 30000, img: U("1601049541289-9b1b7bbbfe19", 500) },
  { id: "n4", name: "Brume Cheveux Légère", type: "Cheveux", price: 19000, img: U("1608248543803-ba4f8c70ae0b", 500) },
];

export const BEST_SELLERS = [
  { id: "b1", name: "Sérum Centella Apaisant", type: "Visage", price: 29000, img: U("1556228720-195a672e8a03", 500) },
  { id: "b2", name: "Toner Acide Hyaluronique", type: "Visage", price: 21000, img: U("1620916566398-39f1143ab7be", 500) },
  { id: "b3", name: "Crème Riz Fermenté", type: "Visage", price: 24000, img: U("1556228578-8c89e6adf883", 500) },
  { id: "b4", name: "Masque Thé Vert Purifiant", type: "Visage", price: 18500, img: U("1612817288484-6f916006741a", 500) },
];

export const CONCERNS = [
  { title: "Hydratation & confort", img: "1556228720-195a672e8a03" },
  { title: "Éclat & teint terne", img: "1620916566398-39f1143ab7be" },
  { title: "Imperfections & pores", img: "1612817288484-6f916006741a" },
  { title: "Anti-âge", img: "1571781926291-c477ebfd024b" },
];

export const PARTNER_BRANDS = ["Hanbit", "Seoul Dew", "Pure Seoul", "Goyo", "Hanok", "Dami"];

export const REVIEWS = [
  { name: "Aïssata D.", city: "Bamako", text: "Une qualité que je n'avais jamais trouvée localement. Le sérum a transformé ma peau en quelques semaines." },
  { name: "Fanta K.", city: "Bamako", text: "Conseil parfait via WhatsApp, livraison rapide. L'expérience est aussi soignée que les produits." },
  { name: "Mariam T.", city: "Kati", text: "J'adore la philosophie de la marque. Des soins simples, efficaces, avec de vrais actifs coréens." },
];

export const ARTICLES = [
  { title: "Construire sa routine en 4 gestes", cat: "Conseils", img: "1556228578-8c89e6adf883" },
  { title: "La mucine d'escargot, secret coréen", cat: "Ingrédients", img: "1620916566398-39f1143ab7be" },
  { title: "Adopter le rituel du soir", cat: "Rituels", img: "1556228720-195a672e8a03" },
];

// Helper de formatage de prix (FCFA)
export const formatPrice = (n) =>
  new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

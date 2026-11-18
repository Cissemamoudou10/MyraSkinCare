// Helper de formatage de prix (FCFA)
// Intl produit une espace fine insécable (U+202F) que les polices Garamond
// n affichent pas (« 10000 ») : on la remplace par une espace insécable classique.
export const formatPrice = (n) =>
  new Intl.NumberFormat("fr-FR").format(n).replace(/ /g, " ") + " FCFA";

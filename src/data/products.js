// Helper de formatage de prix (FCFA)
export const formatPrice = (n) =>
  new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

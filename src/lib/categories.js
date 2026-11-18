// Catégories rangées en arbre, dans l'ordre du menu : chaque rubrique
// (parent_id null) suivie de ses sous-catégories. Renvoie [{ categorie, enfant }].
export function categoriesEnArbre(categories) {
  const parOrdre = (a, b) => (a.ordre ?? 0) - (b.ordre ?? 0) || a.nom.localeCompare(b.nom);
  const racines = categories.filter((c) => !c.parent_id).sort(parOrdre);
  return racines.flatMap((racine) => [
    { categorie: racine, enfant: false },
    ...categories
      .filter((c) => c.parent_id === racine.id)
      .sort(parOrdre)
      .map((c) => ({ categorie: c, enfant: true })),
  ]);
}

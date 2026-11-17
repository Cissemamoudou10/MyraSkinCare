// ============================================================
//  Adresse des images
//  - chemins uploadés (« /uploads/… ») : préfixés par l'adresse de l'API ;
//  - URLs complètes (image_url saisies dans l'admin) : laissées telles quelles ;
//  - pas d'image : visuel neutre local (plus aucune image externe Unsplash).
// ============================================================
const ORIGINE_API = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/api\/?$/, "");

export const IMAGE_PAR_DEFAUT = "/visuel-soin.svg";

export function urlImage(chemin) {
  if (!chemin) return IMAGE_PAR_DEFAUT;
  return /^https?:\/\//.test(chemin) ? chemin : `${ORIGINE_API}${chemin}`;
}

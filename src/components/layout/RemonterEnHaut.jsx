import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Chaque nouvelle page s'ouvre en haut (React Router conserve sinon la
// position de défilement de la page précédente).
// - Seul le chemin compte : changer un filtre de la boutique (?…) ne fait pas sauter la page.
// - Retour arrière du navigateur (POP) : on ne force rien.
export default function RemonterEnHaut() {
  const { pathname } = useLocation();
  const typeNavigation = useNavigationType();

  useLayoutEffect(() => {
    if (typeNavigation === "POP") return;
    // « instant » : html a scroll-behavior: smooth, on ne veut pas d'animation ici
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, typeNavigation]);

  return null;
}

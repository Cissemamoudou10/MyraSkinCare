import { createContext, useContext, useEffect, useState } from "react";
import { fetchCategories, fetchProblemes, fetchMarques } from "@/lib/api";

// ============================================================
//  Construit le menu public (rubriques + sous-rubriques) à partir
//  des référentiels gérés côté admin (Catégories, Problèmes,
//  Marques) : plus besoin de toucher le code du header quand une
//  catégorie est ajoutée, renommée ou réorganisée dans l'admin.
// ============================================================

const NavContext = createContext({ nav: [], loading: true });

// Entrées structurelles : elles pointent vers des pages ou un filtre
// transverse (tag), pas vers un référentiel — elles restent donc
// déclarées ici plutôt qu'automatisées.
const AVANT = [{ label: "Nouveautés", to: "/boutique?filtre=nouveautes", sub: null }];
const APRES = [
  { label: "K-Beauty", to: "/boutique?tag=k-beauty", sub: null },
  { label: "Nos kits", to: "/nos-kits", sub: null },
  { label: "Ingrédients", to: "/ingredients", sub: null },
];

const MAX_FEATURES = 2;

// Transforme une liste d'éléments d'un référentiel en sous-rubriques
// (+ vignettes illustrées pour les éléments qui ont une image_url).
function construireRubrique({ label, to, items, lienItem }) {
  if (!items.length) return { label, to, sub: null };
  const sub = items.map((item) => ({ label: item.nom, to: lienItem(item) }));
  const feature = items
    .filter((item) => item.image_url)
    .slice(0, MAX_FEATURES)
    .map((item) => ({ title: item.nom, img: item.image_url, to: lienItem(item) }));
  return { label, to, sub, feature: feature.length ? feature : undefined };
}

export function NavProvider({ children }) {
  const [nav, setNav] = useState([...AVANT, ...APRES]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let annule = false;

    Promise.all([fetchCategories(), fetchProblemes(), fetchMarques()])
      .then(([cats, problemes, marques]) => {
        if (annule) return;

        const categories = [...(cats.data || [])].sort(
          (a, b) => (a.ordre ?? 0) - (b.ordre ?? 0)
        );

        const rubriquesCategories = categories
          .filter((c) => !c.parent_id && c.affiche_menu !== false)
          .map((rubrique) => {
            const enfants = categories.filter(
              (c) => c.parent_id === rubrique.id && c.affiche_menu !== false
            );
            return construireRubrique({
              label: rubrique.nom,
              to: `/boutique?categorie=${rubrique.id}`,
              items: enfants,
              lienItem: (c) => `/boutique?categorie=${c.id}`,
            });
          });

        const rubriquePreoccupations = construireRubrique({
          label: "Préoccupations",
          to: "/preoccupations",
          items: problemes.data || [],
          lienItem: (p) => `/boutique?probleme=${p.slug}`,
        });

        const rubriqueMarques = construireRubrique({
          label: "Marques",
          to: "/marques",
          items: marques.data || [],
          lienItem: (m) => `/boutique?marque=${m.slug}`,
        });

        setNav([
          ...AVANT,
          rubriquePreoccupations,
          ...rubriquesCategories,
          rubriqueMarques,
          ...APRES,
        ]);
      })
      .catch((err) => console.error("Erreur de chargement du menu :", err))
      .finally(() => !annule && setLoading(false));

    return () => {
      annule = true;
    };
  }, []);

  return <NavContext.Provider value={{ nav, loading }}>{children}</NavContext.Provider>;
}

export const useNav = () => useContext(NavContext);

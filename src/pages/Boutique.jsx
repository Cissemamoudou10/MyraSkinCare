import Select from "@/components/ui/Select";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/ui/ProductCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import FiltresPanneau from "@/components/boutique/FiltresPanneau";
import { SearchIcon } from "@/components/ui/icons";
import {
  fetchProduits, fetchCategories, fetchProblemes, fetchMarques, fetchTypesPeau, fetchTags, fetchActifs,
} from "@/lib/api";
import { categoriesEnArbre } from "@/lib/categories";
import styles from "./Boutique.module.css";

const PAR_PAGE = 12;

const TRIS = [
  { valeur: "", label: "Nouveautés", sort: "date", order: "desc" },
  { valeur: "prix-asc", label: "Prix croissant", sort: "prix", order: "asc" },
  { valeur: "prix-desc", label: "Prix décroissant", sort: "prix", order: "desc" },
  { valeur: "nom", label: "Nom (A → Z)", sort: "nom", order: "asc" },
];

// Paramètres d'URL traités comme des filtres (mêmes noms que l'API /produits).
// L'URL est la seule source de vérité : les liens du menu y écrivent directement.
const FILTRES = ["categorie", "probleme", "typepeau", "marque", "tag", "actif"];
const TITRES_FILTRES = {
  categorie: "Catégorie", probleme: "Préoccupation", typepeau: "Type de peau",
  marque: "Marque", tag: "Sélection", actif: "Ingrédient",
};

const lignes = (reponse) => (Array.isArray(reponse) ? reponse : reponse?.data || []);

// Référentiels nécessaires au panneau et aux libellés des filtres actifs
function useReferentiels() {
  const [ref, setRef] = useState({ categories: [], problemes: [], marques: [], typesPeau: [], tags: [], actifs: [] });
  useEffect(() => {
    Promise.all([fetchCategories(), fetchProblemes(), fetchMarques(), fetchTypesPeau(), fetchTags(), fetchActifs()])
      .then(([categories, problemes, marques, typesPeau, tags, actifs]) =>
        setRef({
          categories: lignes(categories), problemes: lignes(problemes), marques: lignes(marques),
          typesPeau: lignes(typesPeau), tags: lignes(tags), actifs: lignes(actifs),
        })
      )
      .catch((err) => console.error("Erreur référentiels boutique :", err));
  }, []);
  return ref;
}

// Catégories en arbre (rubrique puis ses sous-rubriques), dans l'ordre du menu
const optionsCategories = (categories) =>
  categoriesEnArbre(categories).map(({ categorie, enfant }) => ({ valeur: String(categorie.id), label: categorie.nom, enfant }));

export default function Boutique() {
  const [params, setParams] = useSearchParams();
  const ref = useReferentiels();

  const [produits, setProduits] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [chargement, setChargement] = useState(true);
  const [panneauOuvert, setPanneauOuvert] = useState(false);
  const [recherche, setRecherche] = useState(params.get("q") || "");

  const page = Math.max(1, parseInt(params.get("page"), 10) || 1);
  const tri = TRIS.find((t) => t.valeur === (params.get("tri") || "")) || TRIS[0];
  const nouveautes = params.get("filtre") === "nouveautes";
  const valeurs = Object.fromEntries(FILTRES.map((cle) => [cle, params.get(cle)]));

  // Modifie l'URL ; tout changement autre que la page revient à la page 1
  const majParams = useCallback((modifs) => {
    setParams((actuels) => {
      const suivants = new URLSearchParams(actuels);
      for (const [cle, valeur] of Object.entries(modifs)) {
        if (valeur === null || valeur === undefined || valeur === "") suivants.delete(cle);
        else suivants.set(cle, valeur);
      }
      if (!("page" in modifs)) suivants.delete("page");
      return suivants;
    });
  }, [setParams]);

  // Recherche lancée depuis l'en-tête (ou lien) : le champ local suit l'URL
  const qUrl = params.get("q") || "";
  useEffect(() => {
    setRecherche((actuelle) => (actuelle.trim() === qUrl ? actuelle : qUrl));
  }, [qUrl]);

  // Recherche : l'URL n'est mise à jour qu'après une courte pause de frappe
  useEffect(() => {
    const minuteur = setTimeout(() => {
      if ((params.get("q") || "") !== recherche.trim()) majParams({ q: recherche.trim() });
    }, 350);
    return () => clearTimeout(minuteur);
  }, [recherche]); // eslint-disable-line react-hooks/exhaustive-deps

  // Chargement des produits à chaque changement d'URL
  const cleRequete = params.toString();
  useEffect(() => {
    let annule = false;
    const requete = { page, limit: PAR_PAGE, sort: tri.sort, order: tri.order };
    for (const cle of FILTRES) if (valeurs[cle]) requete[cle] = valeurs[cle];
    if (params.get("q")) requete.q = params.get("q");
    if (nouveautes) requete.nouveautes = "true";

    setChargement(true);
    fetchProduits(requete)
      .then((res) => {
        if (annule) return;
        setProduits(res.data || []);
        setTotal(res.meta?.total ?? 0);
        setPages(res.meta?.pages ?? 1);
      })
      .catch((err) => console.error("Erreur produits :", err))
      .finally(() => !annule && setChargement(false));
    return () => { annule = true; };
  }, [cleRequete]); // eslint-disable-line react-hooks/exhaustive-deps

  // Libellé lisible d'une valeur de filtre (id ou slug selon le paramètre)
  const libelle = useCallback((cle, valeur) => {
    const trouver = (liste, champ) => liste.find((e) => String(e[champ]) === valeur)?.nom;
    switch (cle) {
      case "categorie": return trouver(ref.categories, "id");
      case "typepeau": return trouver(ref.typesPeau, "id");
      case "probleme": return trouver(ref.problemes, "slug");
      case "marque": return trouver(ref.marques, "slug");
      case "tag": return trouver(ref.tags, "slug");
      case "actif": return trouver(ref.actifs, "slug");
      default: return null;
    }
  }, [ref]);

  const sections = useMemo(() => [
    { cle: "categorie", titre: "Catégorie", options: optionsCategories(ref.categories) },
    { cle: "probleme", titre: "Préoccupation", options: ref.problemes.map((p) => ({ valeur: p.slug, label: p.nom })) },
    { cle: "typepeau", titre: "Type de peau", options: ref.typesPeau.map((t) => ({ valeur: String(t.id), label: t.nom })) },
    { cle: "marque", titre: "Marque", colonnes: true, options: ref.marques.map((m) => ({ valeur: m.slug, label: m.nom })) },
  ].filter((s) => s.options.length > 0), [ref]);

  const filtresActifs = FILTRES.filter((cle) => valeurs[cle]).map((cle) => ({
    cle, label: libelle(cle, valeurs[cle]) || valeurs[cle],
  }));
  const nbFiltres = filtresActifs.length + (nouveautes ? 1 : 0);

  // Titre de page : le premier filtre actif donne le contexte (arrivée depuis le menu)
  const contexte = filtresActifs[0];
  const surtitre = qUrl ? "Recherche" : nouveautes ? "Arrivages récents" : contexte ? TITRES_FILTRES[contexte.cle] : "La boutique";
  const titre = qUrl ? `« ${qUrl} »` : nouveautes ? "Nos nouveautés" : contexte ? contexte.label : "Tous nos soins";

  const effacerTout = () => {
    setRecherche("");
    setParams(params.get("tri") ? { tri: params.get("tri") } : {});
  };

  const changerPage = (nouvelle) => {
    majParams({ page: nouvelle > 1 ? String(nouvelle) : null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link to="/">Accueil</Link>
          <span className={styles.sep}>/</span>
          <span className={styles.current}>Boutique</span>
        </nav>

        <header className={styles.head}>
          <p className={styles.eyebrow}>{surtitre}</p>
          <h1 className={styles.title}>{titre}</h1>
        </header>

        <div className={styles.barre}>
          <label className={styles.recherche}>
            <SearchIcon size={15} stroke="var(--color-grey)" />
            <input
              type="search"
              placeholder="Rechercher un soin"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </label>

          <div className={styles.actions}>
            <span className={styles.compte}>
              {chargement ? "…" : `${total} soin${total > 1 ? "s" : ""}`}
            </span>
            <button type="button" className={styles.boutonFiltrer} onClick={() => setPanneauOuvert(true)}>
              Filtrer{nbFiltres > 0 && <span className={styles.pastille}>{nbFiltres}</span>}
            </button>
            <label className={styles.tri}>
              <span>Trier</span>
              <Select
                variant="ligne"
                ariaLabel="Trier"
                value={tri.valeur}
                onChange={(v) => majParams({ tri: v })}
                options={TRIS.map((t) => ({ value: t.valeur, label: t.label }))}
              />
            </label>
          </div>
        </div>

        {nbFiltres > 0 && (
          <div className={styles.puces}>
            {nouveautes && (
              <button type="button" className={styles.puce} onClick={() => majParams({ filtre: null })}>
                Nouveautés <span aria-hidden="true">✕</span>
              </button>
            )}
            {filtresActifs.map((f) => (
              <button key={f.cle} type="button" className={styles.puce} onClick={() => majParams({ [f.cle]: null })}>
                {f.label} <span aria-hidden="true">✕</span>
              </button>
            ))}
            <button type="button" className={styles.toutEffacer} onClick={effacerTout}>
              Tout effacer
            </button>
          </div>
        )}

        {chargement ? (
          <div className={styles.grid}>
            {Array.from({ length: 8 }, (_, n) => <SkeletonCard key={n} />)}
          </div>
        ) : produits.length === 0 ? (
          <div className={styles.vide}>
            <p>Aucun soin ne correspond à cette sélection.</p>
            <button type="button" className={styles.toutEffacer} onClick={effacerTout}>
              Voir tous les soins
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {produits.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}

        {!chargement && pages > 1 && (
          <nav className={styles.pagination} aria-label="Pagination">
            <button type="button" onClick={() => changerPage(page - 1)} disabled={page <= 1}>
              ← Précédent
            </button>
            <span>{page} / {pages}</span>
            <button type="button" onClick={() => changerPage(page + 1)} disabled={page >= pages}>
              Suivant →
            </button>
          </nav>
        )}
      </div>

      <FiltresPanneau
        ouvert={panneauOuvert}
        onFermer={() => setPanneauOuvert(false)}
        sections={sections}
        valeurs={valeurs}
        onChoisir={(cle, valeur) => majParams({ [cle]: valeur })}
        onEffacer={effacerTout}
        total={total}
      />
    </div>
  );
}

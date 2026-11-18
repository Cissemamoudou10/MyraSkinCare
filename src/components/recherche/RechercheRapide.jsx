import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchRecherche } from "@/lib/api";
import { urlImage } from "@/lib/images";
import { SearchIcon } from "@/components/ui/icons";
import styles from "./RechercheRapide.module.css";

const DELAI_MS = 250;
const MIN_CARACTERES = 2;

// Groupes de suggestions secondaires -> filtres de la boutique
const GROUPES = [
  { cle: "marques", titre: "Marques", lien: (e) => `/boutique?marque=${e.slug}` },
  { cle: "problemes", titre: "Préoccupations", lien: (e) => `/boutique?probleme=${e.slug}` },
  { cle: "categories", titre: "Catégories", lien: (e) => `/boutique?categorie=${e.id}` },
  { cle: "principes_actifs", titre: "Ingrédients", lien: (e) => `/boutique?actif=${e.slug}` },
];

// Champ de recherche avec suggestions instantanées.
// Entrée : tous les résultats dans la boutique (filtres disponibles).
// variante : "entete" (barre du header, desktop) ou "plein" (panneau mobile)
export default function RechercheRapide({ variante = "entete", autoFocus = false, onTermine }) {
  const navigate = useNavigate();
  const racine = useRef(null);
  const [terme, setTerme] = useState("");
  const [resultats, setResultats] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [ouvert, setOuvert] = useState(false);

  // Suggestions après une courte pause de frappe ; la dernière requête l'emporte
  useEffect(() => {
    const q = terme.trim();
    if (q.length < MIN_CARACTERES) {
      setResultats(null);
      return undefined;
    }
    let annule = false;
    setChargement(true);
    const minuteur = setTimeout(() => {
      fetchRecherche(q)
        .then((r) => !annule && setResultats(r))
        .catch(() => !annule && setResultats(null))
        .finally(() => !annule && setChargement(false));
    }, DELAI_MS);
    return () => {
      annule = true;
      clearTimeout(minuteur);
    };
  }, [terme]);

  // Fermeture au clic en dehors (barre du header)
  useEffect(() => {
    if (!ouvert || variante !== "entete") return undefined;
    const dehors = (e) => !racine.current?.contains(e.target) && setOuvert(false);
    document.addEventListener("mousedown", dehors);
    return () => document.removeEventListener("mousedown", dehors);
  }, [ouvert, variante]);

  const terminer = () => {
    setOuvert(false);
    setTerme("");
    setResultats(null);
    onTermine?.();
  };

  const voirTout = () => {
    const q = terme.trim();
    if (!q) return;
    navigate(`/boutique?q=${encodeURIComponent(q)}`);
    terminer();
  };

  const clavier = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      voirTout();
    } else if (e.key === "Escape") {
      setOuvert(false);
      if (variante === "plein") onTermine?.();
    }
  };

  const produits = resultats?.produits?.resultats || [];
  const totalProduits = resultats?.produits?.total || 0;
  const groupes = GROUPES
    .map((g) => ({ ...g, elements: (resultats?.[g.cle]?.resultats || []).slice(0, 4) }))
    .filter((g) => g.elements.length > 0);
  const rien = resultats && produits.length === 0 && groupes.length === 0;
  const afficher = (ouvert || variante === "plein") && terme.trim().length >= MIN_CARACTERES;

  return (
    <div ref={racine} className={`${styles.racine} ${styles[variante]}`}>
      <label className={styles.champ}>
        <SearchIcon size={variante === "plein" ? 19 : 16} stroke="var(--color-grey)" />
        <input
          type="search"
          placeholder="Rechercher un soin, une marque…"
          value={terme}
          autoFocus={autoFocus}
          onChange={(e) => {
            setTerme(e.target.value);
            setOuvert(true);
          }}
          onFocus={() => setOuvert(true)}
          onKeyDown={clavier}
          aria-label="Rechercher"
          aria-expanded={afficher}
        />
      </label>

      {afficher && (
        <div className={styles.panneau}>
          {chargement && !resultats && <p className={styles.etat}>Recherche…</p>}
          {rien && <p className={styles.etat}>Aucun résultat pour « {terme.trim()} ».</p>}

          {produits.length > 0 && (
            <section className={styles.groupe}>
              <p className={styles.titre}>Soins</p>
              <ul className={styles.produits}>
                {produits.map((p) => (
                  <li key={p.id}>
                    <Link to={`/produits/${p.slug}`} className={styles.produit} onClick={terminer}>
                      <span className={styles.vignette}>
                        <img src={urlImage(p.photo)} alt="" />
                      </span>
                      <span>
                        {p.marque && <span className={styles.marque}>{p.marque.nom}</span>}
                        <span className={styles.nom}>{p.nom}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {groupes.map((g) => (
            <section key={g.cle} className={styles.groupe}>
              <p className={styles.titre}>{g.titre}</p>
              <ul className={styles.liens}>
                {g.elements.map((e) => (
                  <li key={e.id}>
                    <Link to={g.lien(e)} className={styles.lien} onClick={terminer}>{e.nom}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {totalProduits > 0 && (
            <button type="button" className={styles.voirTout} onClick={voirTout}>
              Voir {totalProduits > 1 ? `les ${totalProduits} soins` : "le soin"} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchKitParSlug } from "@/lib/api";
import { urlImage } from "@/lib/images";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Skeleton from "@/components/ui/Skeleton";
import styles from "./KitDetail.module.css";

export default function KitDetail() {
  const { slug } = useParams();
  const [kit, setKit] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    setChargement(true);
    fetchKitParSlug(slug)
      .then(setKit)
      .catch((err) => setErreur(err.response?.data?.message || "Kit introuvable."))
      .finally(() => setChargement(false));
  }, [slug]);

  if (chargement) {
    return (
      <div className={styles.page}>
        <div className={`container ${styles.grille}`}>
          <Skeleton variant="image" />
          <div>
            <Skeleton variant="title" width="70%" />
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="90%" />
          </div>
        </div>
      </div>
    );
  }

  if (erreur || !kit) {
    return (
      <div className={`${styles.page} ${styles.introuvable}`}>
        <p>{erreur || "Kit introuvable."}</p>
        <Link to="/nos-kits" className={styles.lienDiscret}>Voir tous les kits</Link>
      </div>
    );
  }

  const { prix_plein, prix_final, en_promo, reduction_pourcentage } = kit.prix;
  const produits = kit.produits || [];
  const photos = produits.map((p) => p.photo).filter(Boolean).slice(0, 3);

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.fil}>
          <Link to="/">Accueil</Link>
          <span>/</span>
          <Link to="/nos-kits">Nos kits</Link>
          <span>/</span>
          <span className={styles.filActuel}>{kit.nom}</span>
        </nav>

        <div className={styles.grille}>
          <div className={`${styles.mosaique} ${styles[`mosaique${photos.length}`] || ""}`}>
            {photos.map((photo, i) => (
              <span key={photo} className={styles.case}>
                <img src={urlImage(photo)} alt={i === 0 ? kit.nom : ""} />
              </span>
            ))}
            {en_promo && reduction_pourcentage > 0 && (
              <span className={styles.remise}>−{reduction_pourcentage} %</span>
            )}
          </div>

          <div className={styles.infos}>
            <p className={styles.surtitre}>Kit · {produits.length} soin{produits.length > 1 ? "s" : ""}</p>
            <h1 className={styles.titre}>{kit.nom}</h1>
            <p className={styles.prix}>
              {en_promo && <span className={styles.prixBarre}>{formatPrice(prix_plein)}</span>}
              {formatPrice(en_promo ? prix_final : prix_plein)}
            </p>

            {kit.description && <p className={styles.description}>{kit.description}</p>}

            <button
              type="button"
              className={styles.ajouter}
              onClick={() => addToCart(kit, 1, true)}
              disabled={!kit.actif}
            >
              {kit.actif ? "Ajouter le kit au panier" : "Indisponible"}
            </button>

            <section className={styles.contenu}>
              <h2 className={styles.contenuTitre}>Ce kit contient</h2>
              <ul className={styles.liste}>
                {produits.map((p) => (
                  <li key={p.id}>
                    <Link to={`/produits/${p.slug}`} className={styles.produit}>
                      <span className={styles.vignette}>
                        <img src={urlImage(p.photo)} alt="" />
                      </span>
                      <span className={styles.produitNom}>{p.nom}</span>
                      <span className={styles.produitQte}>× {p.KitProduit?.quantite || 1}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

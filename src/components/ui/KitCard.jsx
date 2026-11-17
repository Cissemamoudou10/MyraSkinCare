import { Link } from "react-router-dom";
import { urlImage } from "@/lib/images";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import styles from "./KitCard.module.css";

// Carte d'un kit : mosaïque des produits qui le composent, prix (avec remise éventuelle)
export function KitCard({ kit }) {
  const { addToCart } = useCart();
  const { prix_plein, prix_final, en_promo, reduction_pourcentage } = kit.prix;
  const produits = kit.produits || [];
  const photos = produits.map((p) => p.photo).filter(Boolean).slice(0, 3);

  return (
    <article className={styles.carte}>
      <Link to={`/nos-kits/${kit.slug}`} className={`${styles.mosaique} ${styles[`mosaique${photos.length}`] || ""}`}>
        {photos.map((photo, i) => (
          <span key={photo} className={styles.case}>
            <img src={urlImage(photo)} alt={i === 0 ? kit.nom : ""} loading="lazy" />
          </span>
        ))}
        {en_promo && reduction_pourcentage > 0 && (
          <span className={styles.remise}>−{reduction_pourcentage} %</span>
        )}
      </Link>

      <p className={styles.surtitre}>Kit · {produits.length} soin{produits.length > 1 ? "s" : ""}</p>
      <Link to={`/nos-kits/${kit.slug}`} className={styles.nom}>{kit.nom}</Link>
      {kit.description && <p className={styles.description}>{kit.description}</p>}

      <div className={styles.pied}>
        <p className={styles.prix}>
          {en_promo && <span className={styles.prixBarre}>{formatPrice(prix_plein)}</span>}
          {formatPrice(en_promo ? prix_final : prix_plein)}
        </p>
        <button type="button" className={styles.ajouter} onClick={() => addToCart(kit, 1, true)} disabled={!kit.actif}>
          {kit.actif ? "Ajouter" : "Indisponible"}
        </button>
      </div>
    </article>
  );
}

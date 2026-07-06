import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";
import { useCart } from "@/context/CartContext";

export function KitCard({ kit }) {
  const { addToCart } = useCart();
  const { prix_plein, prix_final, en_promo, reduction_pourcentage } = kit.prix;
  
  // Extraire les images des produits du kit
  const images = (kit.produits || [])
    .map(p => p.photo)
    .filter(Boolean)
    .slice(0, 3)
    .map(photo => photo.startsWith("http") ? photo : `http://localhost:4000${photo}`);

  return (
    <div className={styles.card}>
      <Link to={`/nos-kits/${kit.slug}`} className={styles.imgLink} style={{ display: 'flex', background: '#f9f9f9', position: 'relative', overflow: 'hidden' }}>
        {images.length > 0 ? (
          <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            {images.map((src, i) => (
              <img 
                key={i} 
                src={src} 
                alt={`${kit.nom} produit ${i+1}`} 
                style={{ 
                  flex: 1, 
                  objectFit: 'cover', 
                  width: `${100 / images.length}%`, 
                  height: '100%',
                  borderLeft: i > 0 ? '1px solid #fff' : 'none'
                }} 
              />
            ))}
          </div>
        ) : (
          <div className={styles.placeholder} />
        )}
        {en_promo && reduction_pourcentage > 0 && (
          <span className={styles.badgePromo}>Promo -{reduction_pourcentage}%</span>
        )}
      </Link>
      
      <div className={styles.info}>
        <Link to={`/nos-kits/${kit.slug}`} className={styles.name}>{kit.nom}</Link>
        
        <div className={styles.priceLine}>
          {en_promo ? (
            <>
              <span className={styles.priceStrikethrough}>{prix_plein} FCFA</span>
              <span className={styles.pricePromo}>{prix_final} FCFA</span>
            </>
          ) : (
            <span className={styles.price}>{prix_plein} FCFA</span>
          )}
        </div>

        <button
          className={styles.addBtn}
          onClick={() => addToCart(kit, 1, true)}
          disabled={!kit.actif}
        >
          {kit.actif ? "Ajouter au panier" : "Indisponible"}
        </button>
      </div>
    </div>
  );
}

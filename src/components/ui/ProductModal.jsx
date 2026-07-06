import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { CloseIcon } from "./icons";
import styles from "./ProductModal.module.css";

const getImgSrc = (photo) => {
  if (!photo) return "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80";
  return photo.startsWith("http") ? photo : `http://localhost:4000${photo}`;
};

export default function ProductModal({ product, onClose }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [qty, setQty] = useState(1);
  const [closing, setClosing] = useState(false);

  // Empêcher le défilement du corps quand le modal est ouvert
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 300); // Correspond à la durée de l'animation CSS
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    handleClose();
    setTimeout(() => {
      setIsCartOpen(true);
    }, 300);
  };

  if (!product) return null;

  const src = getImgSrc(product.photo || product.img);

  return (
    <div className={`${styles.overlay} ${closing ? styles.overlayClosing : ""}`} onClick={handleClose}>
      <div 
        className={`${styles.modal} ${closing ? styles.modalClosing : ""}`} 
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Fermer">
          <CloseIcon size={24} />
        </button>

        <div className={styles.layout}>
          {/* Image (Gauche) */}
          <div className={styles.imageCol}>
            <img src={src} alt={product.nom || product.name} className={styles.image} />
          </div>

          {/* Détails (Droite) */}
          <div className={styles.infoCol}>
            <div className={styles.header}>
              <p className={styles.category}>{product.categorie?.nom || product.type}</p>
              <h2 className={styles.title}>{product.nom || product.name}</h2>
              <p className={styles.price}>
                {formatPrice(product.prix || product.price)}
                {product.stock !== undefined && (
                  <span style={{ 
                    marginLeft: '12px', 
                    fontSize: '11px', 
                    fontFamily: 'var(--font-sans)', 
                    color: product.stock === 0 ? 'var(--color-red)' : 'var(--color-ink-soft)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    {product.stock === 0 ? 'En rupture de stock' : `En stock (${product.stock})`}
                  </span>
                )}
              </p>
            </div>

            <div className={styles.description}>
              <p>{product.description || product.desc || "Une formule douce et efficace conçue pour révéler l'éclat naturel de votre peau tout en respectant son équilibre."}</p>
            </div>

            <div className={styles.actions}>
              <div className={styles.qtyWrapper}>
                <button 
                  className={styles.qtyBtn} 
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={product.stock === 0}
                >−</button>
                <span className={styles.qtyNum}>{product.stock === 0 ? 0 : qty}</span>
                <button 
                  className={styles.qtyBtn} 
                  onClick={() => setQty(q => product.stock ? Math.min(product.stock, q + 1) : q + 1)}
                  disabled={product.stock === 0 || qty >= product.stock}
                >+</button>
              </div>

              <button 
                className={styles.addBtn} 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{ opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}
              >
                {product.stock === 0 ? "Rupture de stock" : `Ajouter au panier — ${formatPrice((product.prix || product.price) * qty)}`}
              </button>
            </div>

            <div className={styles.details}>
              {product.marque && (
                <div className={styles.detailItem}>
                  <h4 className={styles.detailLabel}>Marque</h4>
                  <p className={styles.detailValue}>{product.marque.nom}</p>
                </div>
              )}
              
              {product.types_peau && product.types_peau.length > 0 && (
                <div className={styles.detailItem}>
                  <h4 className={styles.detailLabel}>Idéal pour</h4>
                  <p className={styles.detailValue}>
                    {product.types_peau.map(t => t.nom).join(", ")}
                  </p>
                </div>
              )}

              {product.problemes && product.problemes.length > 0 && (
                <div className={styles.detailItem}>
                  <h4 className={styles.detailLabel}>Cible</h4>
                  <p className={styles.detailValue}>
                    {product.problemes.map(p => p.nom).join(", ")}
                  </p>
                </div>
              )}

              {product.principes_actifs && product.principes_actifs.length > 0 && (
                <div className={styles.detailItem}>
                  <h4 className={styles.detailLabel}>Principes actifs</h4>
                  <p className={styles.detailValue}>
                    {product.principes_actifs.map(a => a.nom).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

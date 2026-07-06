import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/data/products";
import { useProductModal } from "@/context/ProductModalContext";
import styles from "./ProductCard.module.css";

// Fallback image pour les produits sans photo
const getImgSrc = (photo) => {
  if (!photo) return "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=75";
  return photo.startsWith("http") ? photo : `http://localhost:4000${photo}`;
};

export function ProductCard({ p, onOpen }) {
  const [hover, setHover] = useState(false);
  const src = getImgSrc(p.photo || p.img);
  const { openModal } = useProductModal();

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(p);
  };

  return (
    <Link
      to={`/produits/${p.slug || p.id}`}
      className={styles.card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div className={styles.imgWrap}>
        <img
          src={src}
          alt={p.nom || p.name}
          className={styles.img}
          style={{ transform: hover ? "scale(1.05)" : "scale(1)" }}
        />
        <div
          className={styles.cta}
          onClick={handleQuickView}
          style={{
            transform: hover ? "translateY(0)" : "translateY(100%)",
            opacity: hover ? 1 : 0,
          }}
        >
          <span>Aperçu rapide</span>
        </div>
      </div>
      <p className={styles.type}>{p.categorie?.nom || p.type}</p>
      <h3 className={styles.name}>{p.nom || p.name}</h3>
      {(p.description || p.desc) && <p className={styles.desc}>{p.description || p.desc}</p>}
      <p className={styles.price}>{formatPrice(p.prix || p.price)}</p>
    </Link>
  );
}

export function MiniCard({ p, badge }) {
  const [hover, setHover] = useState(false);
  const src = getImgSrc(p.photo || p.img);
  const { openModal } = useProductModal();

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(p);
  };

  return (
    <Link
      to={`/produits/${p.slug || p.id}`}
      className={styles.card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', position: 'relative' }}
    >
      <div className={styles.imgWrap}>
        {badge && <span className={styles.badge}>{badge}</span>}
        <img
          src={src}
          alt={p.nom || p.name}
          className={styles.img}
          style={{ transform: hover ? "scale(1.05)" : "scale(1)" }}
        />
        {/* Ajout de l'aperçu rapide sur la mini carte pour plus de consistance si on survole */}
        <div
          className={styles.cta}
          onClick={handleQuickView}
          style={{
            transform: hover ? "translateY(0)" : "translateY(100%)",
            opacity: hover ? 1 : 0,
            bottom: 0,
            padding: '8px',
            fontSize: '11px'
          }}
        >
          <span>Aperçu rapide</span>
        </div>
      </div>
      <p className={styles.type}>{p.categorie?.nom || p.type}</p>
      <h3 className={styles.nameSm}>{p.nom || p.name}</h3>
      <p className={styles.price}>{formatPrice(p.prix || p.price)}</p>
    </Link>
  );
}

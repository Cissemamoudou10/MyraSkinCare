import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { fetchProduitParSlug } from "@/lib/api";
import { formatPrice } from "@/data/products";
import Skeleton from "@/components/ui/Skeleton";
import styles from "./ProductDetail.module.css";

const getImgSrc = (photo) => {
  if (!photo) return "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80";
  return photo.startsWith("http") ? photo : `http://localhost:4000${photo}`;
};

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, setIsCartOpen } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchProduitParSlug(slug)
      .then(res => setProduct(res.data || res))
      .catch(err => console.error("Erreur chargement produit", err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    setIsCartOpen(true);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ marginBottom: "2rem" }}>
          <Skeleton variant="text" width="200px" />
        </div>
        <div className={styles.layout}>
          <div className={styles.imageCol}>
            <Skeleton variant="image" />
          </div>
          <div className={styles.infoCol}>
            <div className={styles.header}>
              <Skeleton variant="text" width="100px" />
              <Skeleton variant="title" width="80%" />
              <Skeleton variant="text" width="60px" height="24px" />
            </div>
            <div className={styles.description} style={{ marginTop: "2rem" }}>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="95%" />
            </div>
            <div className={styles.actions} style={{ marginTop: "2rem" }}>
              <Skeleton variant="button" width="100%" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Produit introuvable</h2>
        <p>Ce produit n'existe pas ou a été retiré.</p>
        <Link to="/boutique" className={styles.backBtn}>Retour à la boutique</Link>
      </div>
    );
  }

  const src = getImgSrc(product.photo || product.img);

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <Link to="/">Accueil</Link> /{" "}
        <Link to="/boutique">Boutique</Link> /{" "}
        <Link to={`/boutique?categorie=${product.categorie?.nom || ''}`}>
          {product.categorie?.nom || "Non classé"}
        </Link> /{" "}
        <span style={{ color: "var(--color-ink)", fontWeight: 500 }}>{product.nom || product.name}</span>
      </nav>

      <div className={styles.layout}>
        {/* Image (Gauche) */}
        <div className={styles.imageCol}>
          <img src={src} alt={product.nom || product.name} className={styles.image} />
        </div>

        {/* Détails (Droite) */}
        <div className={styles.infoCol}>
          <div className={styles.header}>
            <p className={styles.category}>
              <Link to={`/boutique?categorie=${product.categorie?.nom || ''}`}>
                {product.categorie?.nom || product.type}
              </Link>
            </p>
            <h1 className={styles.title}>{product.nom || product.name}</h1>
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
                <p className={styles.detailValue}>
                  <Link to={`/marques`}>{product.marque.nom}</Link>
                </p>
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
                  {product.problemes.map((p, i) => (
                    <span key={p.id}>
                      <Link to={`/preoccupations?id=${p.id}`}>{p.nom}</Link>
                      {i < product.problemes.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>
            )}

            {product.principes_actifs && product.principes_actifs.length > 0 && (
              <div className={styles.detailItem}>
                <h4 className={styles.detailLabel}>Principes actifs</h4>
                <p className={styles.detailValue}>
                  {product.principes_actifs.map((a, i) => (
                    <span key={a.id}>
                      <Link to={`/ingredients`}>{a.nom}</Link>
                      {i < product.principes_actifs.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

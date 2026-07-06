import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchKitParSlug } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import Skeleton from "@/components/ui/Skeleton";
import styles from "@/components/ui/ProductModal.module.css";
import { ArrowLeft } from "lucide-react";

export default function KitDetail() {
  const { slug } = useParams();
  const [kit, setKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchKitParSlug(slug);
        setKit(data);
      } catch (err) {
        setError(err.response?.data?.message || "Kit introuvable.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div style={{ marginBottom: "2rem" }}>
            <Skeleton variant="text" width="200px" />
          </div>
          <div className={styles.grid}>
            <div className={styles.imgCol}>
              <Skeleton variant="image" />
            </div>
            <div className={styles.infoCol}>
              <Skeleton variant="title" width="60%" />
              <div style={{ marginBottom: "2rem" }}>
                <Skeleton variant="text" width="30%" height="28px" />
              </div>
              <div style={{ marginBottom: "2rem" }}>
                <Skeleton variant="button" width="100%" />
              </div>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="90%" />
              
              <div style={{ marginTop: "3rem" }}>
                <Skeleton variant="title" width="40%" />
                <Skeleton variant="row" width="100%" />
                <Skeleton variant="row" width="100%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !kit) {
    return (
      <div style={{ textAlign: "center", padding: "120px 0", color: "var(--color-ink)" }}>
        <h2>Oups !</h2>
        <p>{error}</p>
        <Link to="/nos-kits" style={{ textDecoration: "underline", marginTop: "1rem", display: "inline-block" }}>
          Retour aux kits
        </Link>
      </div>
    );
  }

  const { prix_plein, prix_final, en_promo, reduction_pourcentage } = kit.prix;
  
  const images = (kit.produits || [])
    .map(p => p.photo)
    .filter(Boolean)
    .slice(0, 4)
    .map(photo => photo.startsWith("http") ? photo : `http://localhost:4000${photo}`);

  return (
    <div className={styles.page}>
      <div className="container">
        <Link to="/nos-kits" className={styles.backLink}>
          <ArrowLeft size={16} /> Retour aux kits
        </Link>

        <div className={styles.grid}>
          <div className={styles.imgCol} style={{ position: 'relative', overflow: 'hidden', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
            {images.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: images.length > 1 ? '1fr 1fr' : '1fr', gridTemplateRows: images.length > 2 ? '1fr 1fr' : '1fr', height: '100%', gap: '2px' }}>
                {images.map((src, i) => (
                  <img 
                    key={i} 
                    src={src} 
                    alt={`${kit.nom} - Image ${i+1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', gridColumn: images.length === 3 && i === 0 ? '1 / -1' : 'auto' }} 
                  />
                ))}
              </div>
            ) : (
              <div className={styles.placeholder} />
            )}
            {en_promo && reduction_pourcentage > 0 && (
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#d32f2f', color: 'white', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>
                Promo -{reduction_pourcentage}%
              </div>
            )}
          </div>

          <div className={styles.infoCol}>
            <h1 className={styles.title}>{kit.nom}</h1>
            
            <div className={styles.priceBlock} style={{ marginBottom: "2rem" }}>
              {en_promo ? (
                <>
                  <span style={{ textDecoration: "line-through", color: "var(--color-grey)", marginRight: "12px", fontSize: "1.2rem" }}>
                    {prix_plein} FCFA
                  </span>
                  <span style={{ color: "#d32f2f", fontSize: "1.5rem", fontWeight: "bold" }}>
                    {prix_final} FCFA
                  </span>
                </>
              ) : (
                <span className={styles.price} style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{prix_plein} FCFA</span>
              )}
            </div>

            <button 
              className={styles.addBtn}
              onClick={() => addToCart(kit, 1, true)}
              disabled={!kit.actif}
              style={{ padding: "16px", fontSize: "14px", width: "100%", marginBottom: "2rem" }}
            >
              {kit.actif ? "Ajouter au panier" : "Indisponible"}
            </button>

            <div className={styles.descBlock}>
              <p>{kit.description}</p>
            </div>

            <div style={{ marginTop: "3rem", padding: "2rem", background: "rgba(250, 248, 244, 0.5)", border: "1px solid var(--color-line)", borderRadius: "8px" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", marginBottom: "1.5rem" }}>Ce kit contient :</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {kit.produits && kit.produits.map(prod => (
                  <li key={prod.id} style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center", borderBottom: "1px solid var(--color-line)", paddingBottom: "1rem" }}>
                    {prod.photo && (
                      <img src={`http://localhost:4000${prod.photo}`} alt={prod.nom} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <Link to={`/produits/${prod.slug}`} style={{ fontWeight: "500", textDecoration: "none", color: "var(--color-ink)" }}>
                        {prod.nom}
                      </Link>
                      <div style={{ color: "var(--color-grey)", fontSize: "0.9rem", marginTop: "4px" }}>
                        Quantité : {prod.KitProduit ? prod.KitProduit.quantite : 1}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

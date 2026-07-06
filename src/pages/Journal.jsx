import { useState, useEffect } from "react";
import { fetchPublicArticles } from "@/lib/api";
import { X } from "lucide-react";
import styles from "./Journal.module.css";

export default function Journal() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tout");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchPublicArticles()
      .then(res => setArticles(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredArticles = filter === "tout" 
    ? articles 
    : articles.filter(a => a.type === filter);

  // Verrouiller le scroll quand la modale est ouverte
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedArticle]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <span>Accueil</span>
          <span className={styles.sep}>/</span>
          <span className={styles.current}>Le Journal Myra</span>
        </nav>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Expertise & Conseils</p>
          <h1 className={styles.title}>Le Journal</h1>
          <p className={styles.subtitle}>
            Découvrez nos rituels, conseils d'experts et plongez au cœur de nos ingrédients.
          </p>
        </header>

      <div className={styles.filters}>
        {["tout", "conseil", "rituel", "ingredient"].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ""}`}
          >
            {f === "tout" ? "Tout voir" : f === "ingredient" ? "Ingrédients" : f + "s"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Chargement du journal...</div>
      ) : filteredArticles.length === 0 ? (
        <div className={styles.empty}>Aucun article pour le moment. Revenez bientôt !</div>
      ) : (
        <div className={styles.grid}>
          {filteredArticles.map(article => (
            <div 
              key={article.id} 
              className={styles.card}
              onClick={() => setSelectedArticle(article)}
            >
              <div className={styles.imageWrapper}>
                {article.image_url ? (
                  <img src={article.image_url} alt={article.titre} className={styles.image} />
                ) : (
                  <div className={styles.imagePlaceholder} />
                )}
                <span className={styles.badge}>{article.type}</span>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{article.titre}</h3>
                <p className={styles.cardExcerpt}>
                  {article.contenu.substring(0, 100)}...
                </p>
                <span className={styles.readMore}>Lire la suite</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Article */}
      {selectedArticle && (
        <div className={styles.modalOverlay} onClick={() => setSelectedArticle(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedArticle(null)}>
              <X size={24} />
            </button>
            
            {selectedArticle.image_url && (
              <div className={styles.modalHero}>
                <img src={selectedArticle.image_url} alt={selectedArticle.titre} />
              </div>
            )}
            
            <div className={styles.modalBody}>
              <div className={styles.modalMeta}>
                <span className={styles.modalBadge}>{selectedArticle.type}</span>
                <span className={styles.modalDate}>
                  {new Date(selectedArticle.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
              
              <h2 className={styles.modalTitle}>{selectedArticle.titre}</h2>
              
              <div className={styles.modalText}>
                {selectedArticle.contenu.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

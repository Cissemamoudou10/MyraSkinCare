import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ProductCard } from "@/components/ui/ProductCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { fetchProduits, fetchCategories } from "@/lib/api";
import { SearchIcon } from "@/components/ui/icons";
import styles from "./Boutique.module.css";

export default function Boutique() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isNouveautes = searchParams.get("filtre") === "nouveautes";
  const tagParam = searchParams.get("tag");
  const problemeParam = searchParams.get("probleme");
  const marqueParam = searchParams.get("marque");
  const actifParam = searchParams.get("actif");

  const [cat, setCat] = useState("Tous");
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Charger les catégories une seule fois
  useEffect(() => {
    fetchCategories()
      .then(res => setCategories(res.data || []))
      .catch(err => console.error("Erreur catégories", err));
  }, []);

  // Recharger les produits quand la catégorie, la page, la recherche ou le filtre change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        
        // Recherche
        if (query.trim()) params.q = query.trim();

        // Filtre Catégorie
        if (cat !== "Tous") {
          const c = categories.find(x => x.nom === cat);
          if (c) params.categorie = c.id;
        }

        // Tri Nouveautés
        if (isNouveautes) {
          params.sort = "date";
          params.order = "desc";
        }
        
        // Filtres Dynamiques (issus de la navigation)
        if (tagParam) params.tag = tagParam;
        if (problemeParam) params.probleme = problemeParam;
        if (marqueParam) params.marque = marqueParam;
        if (actifParam) params.actif = actifParam;

        const response = await fetchProduits(params);
        setProducts(response.data || []);
        setTotalPages(response.meta?.totalPages || 1);
      } catch (error) {
        console.error("Erreur produits :", error);
      } finally {
        setLoading(false);
      }
    };
    if (cat === "Tous" || categories.length > 0) {
      loadData();
    }
  }, [cat, page, categories, query, isNouveautes, tagParam, problemeParam, marqueParam, actifParam]);

  const handleCatChange = (c) => {
    setCat(c);
    setPage(1); 
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <span>Accueil</span>
          <span className={styles.sep}>/</span>
          <span className={styles.current}>Boutique</span>
        </nav>

        <header className={styles.head}>
          <p className={styles.eyebrow}>
            {isNouveautes ? "Arrivages récents" : 
             tagParam ? `Catégorie : ${tagParam.toUpperCase()}` :
             problemeParam ? `Préoccupation : ${problemeParam.toUpperCase()}` :
             marqueParam ? `Marque : ${marqueParam.toUpperCase()}` :
             actifParam ? `Ingrédient : ${actifParam.toUpperCase()}` : "La boutique"}
          </p>
          <h1 className={styles.title}>{isNouveautes ? "Nos Nouveautés" : "Tous nos soins"}</h1>
        </header>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#f5f5f5", padding: "0.5rem 1rem", borderRadius: "50px", width: "100%", maxWidth: "300px" }}>
            <SearchIcon size={18} stroke="var(--color-grey)" />
            <input 
              type="search" 
              placeholder="Rechercher ici..." 
              value={query}
              onChange={handleSearchChange}
              style={{ border: "none", background: "transparent", padding: "0.5rem", width: "100%", outline: "none" }}
            />
          </div>

          <div className={styles.filters} style={{ marginBottom: 0, borderBottom: "none", flex: 1, justifyContent: "flex-end" }}>
            <button
              className={`${styles.pill} ${cat === "Tous" ? styles.pillOn : ""}`}
              onClick={() => handleCatChange("Tous")}
            >
              Tous
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`${styles.pill} ${cat === c.nom ? styles.pillOn : ""}`}
                onClick={() => handleCatChange(c.nom)}
              >
                {c.nom}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
              {products.length === 0 && (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
                  Aucun produit trouvé dans cette catégorie.
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "3rem" }}>
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1}
                  style={{ padding: "0.5rem 1rem", border: "1px solid #ddd", background: page === 1 ? "#f5f5f5" : "white", cursor: page === 1 ? "not-allowed" : "pointer" }}
                >
                  Précédent
                </button>
                <span style={{ padding: "0.5rem", display: "flex", alignItems: "center" }}>
                  Page {page} sur {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages}
                  style={{ padding: "0.5rem 1rem", border: "1px solid #ddd", background: page === totalPages ? "#f5f5f5" : "white", cursor: page === totalPages ? "not-allowed" : "pointer" }}
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


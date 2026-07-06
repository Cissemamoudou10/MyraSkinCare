import { useState, useEffect } from "react";
import { KitCard } from "@/components/ui/KitCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { fetchKits } from "@/lib/api";
import { SearchIcon } from "@/components/ui/icons";
import styles from "./Boutique.module.css";

export default function Kits() {
  const [query, setQuery] = useState("");
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (query.trim()) params.q = query.trim();

        const response = await fetchKits(params);
        setKits(response.data || []);
        setTotalPages(response.meta?.totalPages || 1);
      } catch (error) {
        console.error("Erreur kits :", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page, query]);

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
          <span className={styles.current}>Nos Kits</span>
        </nav>

        <header className={styles.head}>
          <p className={styles.eyebrow}>Routines & Ensembles</p>
          <h1 className={styles.title}>Nos Kits Soins</h1>
        </header>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#f5f5f5", padding: "0.5rem 1rem", borderRadius: "50px", width: "100%", maxWidth: "300px" }}>
            <SearchIcon size={18} stroke="var(--color-grey)" />
            <input 
              type="search" 
              placeholder="Rechercher un kit..." 
              value={query}
              onChange={handleSearchChange}
              style={{ border: "none", background: "transparent", padding: "0.5rem", width: "100%", outline: "none" }}
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {kits.map((k) => (
                <KitCard key={k.id} kit={k} />
              ))}
              {kits.length === 0 && (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
                  Aucun kit ne correspond à votre recherche.
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

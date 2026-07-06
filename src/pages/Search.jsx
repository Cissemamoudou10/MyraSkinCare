import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchRecherche } from "@/lib/api";
import { ProductCard } from "@/components/ui/ProductCard";

export default function Search() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get("q") || "";

  useEffect(() => {
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchRecherche(q)
      .then(res => setResults(res.data?.produits || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div style={{ padding: "120px 5% 5%" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Résultats de recherche</h1>
      <p style={{ color: "var(--color-grey)", marginBottom: "3rem", maxWidth: "600px" }}>
        {q ? `Résultats pour "${q}"` : "Veuillez entrer un terme de recherche."}
      </p>

      {loading ? (
        <p>Recherche en cours...</p>
      ) : results.length === 0 && q ? (
        <p>Aucun produit ne correspond à votre recherche.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
          {results.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

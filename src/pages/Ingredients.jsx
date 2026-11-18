import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchActifs } from "@/lib/api";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import styles from "./Concerns.module.css";

export default function Ingredients() {
  const [actifs, setActifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActifs()
      .then(res => setActifs(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className="container">
        <Reveal>
          <SectionHead 
            eyebrow="Formules de pointe" 
            title="Principes Actifs" 
            sub="La K-Beauty est réputée pour ses ingrédients innovants et respectueux de la peau. Filtrez notre catalogue par principe actif." 
          />
        </Reveal>

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--color-grey)" }}>Chargement...</p>
        ) : (
          <div className={styles.tuiles}>
            {actifs.map((a) => (
              <Link key={a.id} to={`/boutique?actif=${a.slug}`} className={styles.tuile}>
                <span className={styles.tuileNom}>{a.nom}</span>
                <span className={styles.tuileLien}>Voir les soins →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

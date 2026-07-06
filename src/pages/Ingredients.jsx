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
          <div className={styles.grid}>
            {actifs.map((a, i) => (
              <Reveal key={a.id} delay={(i % 4) * 0.1}>
                <Link to={`/boutique?actif=${a.slug}`} className={styles.card}>
                  <div className={styles.imageContainer} style={{ aspectRatio: '1' }}>
                    <div className={styles.placeholderImage}>
                      <span style={{ fontSize: '1.25rem', padding: '1rem' }}>{a.nom}</span>
                    </div>
                  </div>
                  <h3 className={styles.cardTitle}>{a.nom}</h3>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

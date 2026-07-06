import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProblemes } from "@/lib/api";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import styles from "./Concerns.module.css";

export default function Concerns() {
  const [problemes, setProblemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblemes()
      .then(res => setProblemes(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className="container">
        <Reveal>
          <SectionHead 
            eyebrow="Shop by concern" 
            title="Préoccupations de peau" 
            sub="Sélectionnez votre préoccupation principale pour découvrir notre sélection de soins ciblés." 
          />
        </Reveal>

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--color-grey)" }}>Chargement...</p>
        ) : (
          <div className={styles.grid}>
            {problemes.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.1}>
                <Link to={`/boutique?probleme=${p.slug}`} className={styles.card}>
                  <div className={styles.imageContainer}>
                    {p.image_url ? (
                      <img src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${p.image_url}`} alt={p.nom} className={styles.image} />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <span>{p.nom}</span>
                      </div>
                    )}
                  </div>
                  <h3 className={styles.cardTitle}>{p.nom}</h3>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

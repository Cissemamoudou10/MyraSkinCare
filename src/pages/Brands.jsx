import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchMarques } from "@/lib/api";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import styles from "./Concerns.module.css";

export default function Brands() {
  const [marques, setMarques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarques()
      .then(res => setMarques(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className="container">
        <Reveal>
          <SectionHead 
            eyebrow="Notre sélection" 
            title="Les Marques Partenaires" 
            sub="Découvrez l'excellence de la K-Beauty à travers nos marques partenaires sélectionnées pour l'efficacité de leurs formules." 
          />
        </Reveal>

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--color-grey)" }}>Chargement...</p>
        ) : (
          <div className={styles.grid}>
            {marques.map((m, i) => (
              <Reveal key={m.id} delay={(i % 4) * 0.1}>
                <Link to={`/boutique?marque=${m.slug}`} className={styles.card}>
                  <div className={styles.imageContainer}>
                    {m.image_url ? (
                      <img src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${m.image_url}`} alt={m.nom} className={styles.image} style={{ objectFit: 'contain', padding: '1rem' }} />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <span>{m.nom}</span>
                      </div>
                    )}
                  </div>
                  <h3 className={styles.cardTitle}>{m.nom}</h3>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

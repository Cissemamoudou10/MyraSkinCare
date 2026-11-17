import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { KitCard } from "@/components/ui/KitCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { fetchKits } from "@/lib/api";
import styles from "./Boutique.module.css";

// Les kits sont peu nombreux : tout est chargé en une fois, sans recherche ni pagination
export default function Kits() {
  const [kits, setKits] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetchKits({ limit: 100 })
      .then((res) => setKits(res.data || []))
      .catch((err) => console.error("Erreur kits :", err))
      .finally(() => setChargement(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link to="/">Accueil</Link>
          <span className={styles.sep}>/</span>
          <span className={styles.current}>Nos kits</span>
        </nav>

        <header className={styles.head}>
          <p className={styles.eyebrow}>Routines composées</p>
          <h1 className={styles.title}>Nos kits</h1>
          <p className={styles.intro}>
            Des routines complètes, pensées pour fonctionner ensemble : il suffit de les adopter.
          </p>
        </header>

        {chargement ? (
          <div className={styles.gridKits}>
            {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : kits.length === 0 ? (
          <div className={styles.vide}>
            <p>Nos kits arrivent bientôt.</p>
            <Link to="/boutique" className={styles.toutEffacer}>Voir tous les soins</Link>
          </div>
        ) : (
          <div className={styles.gridKits}>
            {kits.map((kit) => <KitCard key={kit.id} kit={kit} />)}
          </div>
        )}
      </div>
    </div>
  );
}

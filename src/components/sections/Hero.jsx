import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { fetchProduits } from "@/lib/api";
import { urlImage } from "@/lib/images";
import styles from "./Hero.module.css";

// Emplacements des vignettes flottantes ; les images viennent du catalogue
const EMPLACEMENTS = [
  { top: "12%", left: "8%", w: 150, rot: -14, op: 0.55 },
  { top: "60%", left: "6%", w: 130, rot: 9, op: 0.5 },
  { top: "22%", left: "82%", w: 140, rot: 18, op: 0.55 },
  { top: "64%", left: "84%", w: 155, rot: -22, op: 0.5 },
  { top: "6%", left: "60%", w: 110, rot: 24, op: 0.45 },
  { top: "74%", left: "44%", w: 120, rot: -8, op: 0.45 },
  { top: "40%", left: "90%", w: 100, rot: 30, op: 0.42 },
  { top: "44%", left: "2%", w: 105, rot: -28, op: 0.42 },
];

export default function Hero() {
  const [photos, setPhotos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchProduits({ limit: EMPLACEMENTS.length, sort: "date", order: "desc" })
      .then((res) => setPhotos((res.data || []).map((p) => p.photo).filter(Boolean)))
      .catch(() => setPhotos([]))
      .finally(() => setTimeout(() => setLoaded(true), 100));
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.tiles}>
        {photos.map((photo, i) => {
          const t = EMPLACEMENTS[i];
          return (
            <div
              key={photo}
              className={styles.tile}
              style={{
                top: t.top,
                left: t.left,
                width: t.w,
                transform: loaded
                  ? `rotate(${t.rot}deg) translateY(0)`
                  : `rotate(${t.rot}deg) translateY(18px)`,
                opacity: loaded ? t.op : 0,
                transition: `opacity 1.4s ease ${i * 0.08}s, transform 1.4s ease ${i * 0.08}s`,
              }}
            >
              <img src={urlImage(photo)} alt="" />
            </div>
          );
        })}
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>Beauté coréenne · K-Beauty</p>
        <h1 className={styles.title}>
          L'essentiel,<br />
          <em>magnifié</em>
        </h1>
        <p className={styles.sub}>
          La beauté coréenne au service de votre éclat naturel.
        </p>
        <Button variant="dark" to="/boutique">Découvrir la collection</Button>
      </div>
    </section>
  );
}

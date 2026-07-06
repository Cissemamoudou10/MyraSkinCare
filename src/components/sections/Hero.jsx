import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import styles from "./Hero.module.css";

const TILES = [
  { img: "1556228720-195a672e8a03", top: "12%", left: "8%", w: 150, rot: -14, op: 0.5 },
  { img: "1601049541289-9b1b7bbbfe19", top: "60%", left: "6%", w: 130, rot: 9, op: 0.45 },
  { img: "1620916566398-39f1143ab7be", top: "22%", left: "82%", w: 140, rot: 18, op: 0.5 },
  { img: "1608248543803-ba4f8c70ae0b", top: "64%", left: "84%", w: 155, rot: -22, op: 0.45 },
  { img: "1556228578-8c89e6adf883", top: "6%", left: "60%", w: 110, rot: 24, op: 0.4 },
  { img: "1612817288484-6f916006741a", top: "74%", left: "44%", w: 120, rot: -8, op: 0.4 },
  { img: "1571781926291-c477ebfd024b", top: "40%", left: "90%", w: 100, rot: 30, op: 0.38 },
  { img: "1580870069867-74c57ee1bb07", top: "44%", left: "2%", w: 105, rot: -28, op: 0.38 },
];

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.tiles}>
        {TILES.map((t, i) => (
          <div
            key={i}
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
            <img src={`https://images.unsplash.com/photo-${t.img}?w=400&q=70`} alt="" />
          </div>
        ))}
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
        <Button variant="dark">Découvrir la collection</Button>
      </div>
    </section>
  );
}

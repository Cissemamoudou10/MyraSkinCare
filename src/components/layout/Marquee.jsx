import { MARQUEE } from "@/data/navigation";
import styles from "./Marquee.module.css";

function Row({ items, dir }) {
  return (
    <div className={styles.row}>
      <div className={`${styles.track} ${dir === "rtl" ? styles.rtl : ""}`}>
        {items.map((w, i) => (
          <span key={i} className={styles.item}>
            {w}
            <span className={styles.star}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const line1 = [...MARQUEE, ...MARQUEE];
  const rev = [...MARQUEE].reverse();
  const line2 = [...rev, ...rev];

  return (
    <div className={styles.wrap}>
      <Row items={line1} dir="ltr" />
      <Row items={line2} dir="rtl" />
    </div>
  );
}

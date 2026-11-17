import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./NavItem.module.css";

export default function NavItem({ item, alignRight }) {
  const [open, setOpen] = useState(false);
  const hasSub = !!item.sub;
  const hasFeature = !!item.feature;
  const wide = hasFeature && alignRight;
  // Au-delà de 8 sous-rubriques (ex. les marques), affichage en colonnes de 8
  const enColonnes = hasSub && item.sub.length > 8;

  return (
    <div
      className={styles.wrap}
      onMouseEnter={() => hasSub && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link to={item.to || "#"} className={styles.label}>
        {item.label}
        {hasSub && (
          <span className={`${styles.caret} ${open ? styles.caretOpen : ""}`}>▾</span>
        )}
      </Link>

      {hasSub && (
        <div
          className={`${styles.panel} ${hasFeature ? styles.mega : ""} ${
            wide ? styles.alignRight : styles.alignCenter
          } ${open ? styles.open : ""}`}
        >
          <div className={`${styles.links} ${enColonnes ? styles.colonnes : ""}`}>
            {item.sub.map((s) => (
              <Link key={s.label} to={s.to || "#"} className={styles.sublink}>
                {s.label}
              </Link>
            ))}
          </div>

          {hasFeature && (
            <div className={styles.features}>
              {item.feature.map((f) => (
                <Link key={f.title} to={f.to || item.to || "#"} className={styles.feature}>
                  <div className={styles.featureImg}>
                    <img src={f.img} alt="" />
                  </div>
                  <span className={styles.featureTitle}>{f.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

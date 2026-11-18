import { Fragment } from "react";
import { Link } from "react-router-dom";
import styles from "./FilAriane.module.css";

// Fil d'Ariane unique pour toutes les pages : même police, même taille partout.
// etapes : [{ label, to }] ; la dernière étape (page courante) n'a pas de lien.
export default function FilAriane({ etapes }) {
  return (
    <nav className={styles.fil} aria-label="Fil d'Ariane">
      {etapes.map((etape, i) => {
        const derniere = i === etapes.length - 1;
        return (
          <Fragment key={`${etape.label}-${i}`}>
            {derniere || !etape.to ? (
              <span className={derniere ? styles.actuel : undefined} aria-current={derniere ? "page" : undefined}>
                {etape.label}
              </span>
            ) : (
              <Link to={etape.to}>{etape.label}</Link>
            )}
            {!derniere && <span className={styles.separateur} aria-hidden="true">/</span>}
          </Fragment>
        );
      })}
    </nav>
  );
}

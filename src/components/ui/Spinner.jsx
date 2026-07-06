import styles from "./Spinner.module.css";

/**
 * Composant Spinner pour les temps de chargement.
 * Minimaliste, utilise les tokens de global.css
 * 
 * @param {"sm" | "md" | "lg"} size Taille du spinner
 * @param {"ink" | "gold" | "white" | "grey"} color Couleur de la bordure
 * @param {boolean} center Centre le spinner dans son conteneur
 * @param {boolean} fullHeight Prend toute la hauteur pour centrer (utile pour les pages)
 */
export default function Spinner({ size = "md", color = "ink", center = false, fullHeight = false }) {
  const spinnerElement = (
    <div className={`${styles.spinner} ${styles[size]} ${styles[color]}`} />
  );

  if (center || fullHeight) {
    return (
      <div className={`${styles.container} ${fullHeight ? styles.fullHeight : ""}`}>
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
}

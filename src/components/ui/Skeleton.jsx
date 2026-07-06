import styles from "./Skeleton.module.css";

/**
 * Composant Skeleton pour l'attente de contenu (shimmer effect).
 * 
 * @param {"text" | "title" | "image" | "button" | "row"} variant La forme du skeleton
 * @param {string} width Largeur personnalisée (ex: "50%", "200px")
 * @param {string} height Hauteur personnalisée (ex: "100px")
 * @param {string} className Classes CSS additionnelles
 */
export default function Skeleton({ variant = "text", width, height, className = "" }) {
  return (
    <div 
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

/**
 * Préfiguration complète d'une carte produit.
 */
export function SkeletonCard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <Skeleton variant="image" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="title" width="80%" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
}

/**
 * Préfiguration d'une ligne de tableau pour l'admin
 */
export function SkeletonRow() {
  return (
    <Skeleton variant="row" width="100%" />
  );
}

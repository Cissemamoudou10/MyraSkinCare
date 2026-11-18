import { useEffect } from "react";
import RechercheRapide from "./RechercheRapide";
import styles from "./RechercheMobile.module.css";

// Panneau de recherche plein écran (mobile), ouvert par la loupe du header
export default function RechercheMobile({ ouvert, onFermer }) {
  useEffect(() => {
    if (!ouvert) return undefined;
    const debordement = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = debordement; };
  }, [ouvert]);

  if (!ouvert) return null;
  return (
    <div className={styles.panneau} role="dialog" aria-label="Recherche">
      <div className={styles.entete}>
        <p className={styles.titre}>Rechercher</p>
        <button type="button" className={styles.fermer} onClick={onFermer}>Fermer ✕</button>
      </div>
      <RechercheRapide variante="plein" autoFocus onTermine={onFermer} />
    </div>
  );
}

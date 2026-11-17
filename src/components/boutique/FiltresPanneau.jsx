import { useEffect } from "react";
import styles from "./FiltresPanneau.module.css";

// Panneau latéral des filtres de la boutique.
// Chaque section correspond à un paramètre d'URL (même nom que l'API).
// Un clic applique le filtre immédiatement ; un second clic le retire.
export default function FiltresPanneau({ ouvert, onFermer, sections, valeurs, onChoisir, onEffacer, total }) {
  // Fermeture au clavier et blocage du défilement de la page pendant l'ouverture
  useEffect(() => {
    if (!ouvert) return undefined;
    const echap = (e) => e.key === "Escape" && onFermer();
    document.addEventListener("keydown", echap);
    const debordement = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", echap);
      document.body.style.overflow = debordement;
    };
  }, [ouvert, onFermer]);

  return (
    <>
      <div className={`${styles.voile} ${ouvert ? styles.voileOuvert : ""}`} onClick={onFermer} aria-hidden="true" />
      <aside
        className={`${styles.panneau} ${ouvert ? styles.panneauOuvert : ""}`}
        aria-label="Filtres"
        aria-hidden={!ouvert}
      >
        <header className={styles.entete}>
          <p className={styles.titre}>Filtrer</p>
          <button type="button" className={styles.fermer} onClick={onFermer} aria-label="Fermer les filtres">
            Fermer ✕
          </button>
        </header>

        <div className={styles.contenu}>
          {sections.map((section) => (
            <section key={section.cle} className={styles.section}>
              <h3 className={styles.sectionTitre}>{section.titre}</h3>
              <ul className={`${styles.options} ${section.colonnes ? styles.optionsColonnes : ""}`}>
                {section.options.map((option) => {
                  const actif = valeurs[section.cle] === option.valeur;
                  return (
                    <li key={option.valeur}>
                      <button
                        type="button"
                        className={`${styles.option} ${option.enfant ? styles.optionEnfant : ""} ${actif ? styles.optionActive : ""}`}
                        onClick={() => onChoisir(section.cle, actif ? null : option.valeur)}
                        aria-pressed={actif}
                      >
                        {option.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <footer className={styles.pied}>
          <button type="button" className={styles.effacer} onClick={onEffacer}>
            Tout effacer
          </button>
          <button type="button" className={styles.voir} onClick={onFermer}>
            Voir {total} soin{total > 1 ? "s" : ""}
          </button>
        </footer>
      </aside>
    </>
  );
}

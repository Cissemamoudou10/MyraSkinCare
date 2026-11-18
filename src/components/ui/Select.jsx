import { useEffect, useId, useRef, useState } from "react";
import styles from "./Select.module.css";

// Liste déroulante aux couleurs du site (remplace le <select> natif du navigateur).
// - options : [{ value, label }] ; onChange reçoit la value de l'option choisie
// - variant : "ligne" (souligné, vitrine) ou "champ" (encadré, formulaires admin)
// - required : conserve la validation native du formulaire via un champ masqué
export default function Select({
  value, onChange, options, placeholder = "Choisir…", variant = "champ",
  id, ariaLabel, required = false, disabled = false,
}) {
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState(-1);
  const racine = useRef(null);
  const listeId = useId();

  const indexChoisi = options.findIndex((o) => String(o.value) === String(value ?? ""));
  const choisie = options[indexChoisi];

  // Fermeture au clic en dehors
  useEffect(() => {
    if (!ouvert) return undefined;
    const dehors = (e) => !racine.current?.contains(e.target) && setOuvert(false);
    document.addEventListener("mousedown", dehors);
    return () => document.removeEventListener("mousedown", dehors);
  }, [ouvert]);

  const ouvrir = () => {
    if (disabled) return;
    setActif(indexChoisi >= 0 ? indexChoisi : 0);
    setOuvert(true);
  };

  const choisir = (option) => {
    onChange(option.value);
    setOuvert(false);
  };

  const clavier = (e) => {
    if (!ouvert) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        ouvrir();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOuvert(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActif((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActif((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (options[actif]) choisir(options[actif]);
    } else if (e.key === "Tab") {
      setOuvert(false);
    }
  };

  return (
    <div ref={racine} className={`${styles.racine} ${styles[variant]} ${disabled ? styles.desactive : ""}`}>
      <button
        type="button"
        id={id}
        className={styles.bouton}
        onClick={() => (ouvert ? setOuvert(false) : ouvrir())}
        onKeyDown={clavier}
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        aria-controls={listeId}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        <span className={choisie ? styles.valeur : styles.placeholder}>
          {choisie ? choisie.label : placeholder}
        </span>
        <span className={`${styles.fleche} ${ouvert ? styles.flecheOuverte : ""}`} aria-hidden="true" />
      </button>

      {required && (
        <input
          className={styles.validation}
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value ?? ""}
          onChange={() => {}}
          onFocus={ouvrir}
        />
      )}

      {ouvert && (
        <ul id={listeId} role="listbox" className={styles.liste}>
          {options.map((option, i) => (
            <li
              key={String(option.value)}
              role="option"
              aria-selected={i === indexChoisi}
              className={`${styles.option} ${i === actif ? styles.optionActive : ""} ${i === indexChoisi ? styles.optionChoisie : ""}`}
              onMouseEnter={() => setActif(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                choisir(option);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

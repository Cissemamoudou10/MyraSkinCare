import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import styles from "./Button.module.css";

/**
 * Bouton réutilisable.
 * @param {"dark"|"solid"|"light"} variant
 * @param {boolean} isLoading Affiche un spinner et désactive le bouton
 */
export default function Button({ children, variant = "dark", onClick, type = "button", as, to, isLoading = false, disabled, ...rest }) {
  const className = `${styles.btn} ${styles[variant]} ${isLoading ? styles.loading : ""}`;
  
  // Désactiver si isLoading ou disabled explicitly
  const isDisabled = isLoading || disabled;

  if ((as === "link" || to) && !isDisabled) {
    // Si as prop is not a string, it might be a component (like Link passed from caller), but to be safe, just use Link directly if 'to' is present
    return (
      <Link to={to || "#"} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  // Déterminer la couleur du spinner selon le variant
  const spinnerColor = variant === "light" ? "ink" : "white";

  return (
    <button type={type} className={className} onClick={onClick} disabled={isDisabled} {...rest}>
      {isLoading ? <Spinner size="sm" color={spinnerColor} /> : children}
    </button>
  );
}

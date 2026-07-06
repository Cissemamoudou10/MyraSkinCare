// Icônes SVG fines et cohérentes avec l'esthétique minimaliste.
// Chacune accepte size et les props SVG standard.

export function SearchIcon({ size = 18, stroke = "currentColor", ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth="1.6" strokeLinecap="round" {...rest}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  );
}

export function CartIcon({ size = 23, stroke = "currentColor", ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth="1.4" {...rest}>
      <path d="M6 8 H18 L17 20 H7 Z" strokeLinejoin="round" />
      <path d="M9 8 V6.5 A3 3 0 0 1 15 6.5 V8" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon({ size = 24, stroke = "currentColor", ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth="1.4" strokeLinecap="round" {...rest}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function CloseIcon({ size = 20, stroke = "currentColor", ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth="1.5" strokeLinecap="round" {...rest}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

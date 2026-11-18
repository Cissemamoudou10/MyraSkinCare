import { Navigate, useSearchParams } from "react-router-dom";

// Ancienne page de résultats : la recherche s'affiche désormais dans la boutique
// (mêmes cartes, filtres et tri). Redirection conservée pour les liens existants.
export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q");
  return <Navigate replace to={q ? `/boutique?q=${encodeURIComponent(q)}` : "/boutique"} />;
}

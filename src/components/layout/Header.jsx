import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAV } from "@/data/navigation";
import NavItem from "./NavItem";
import { SearchIcon, CartIcon, MenuIcon } from "@/components/ui/icons";
import logo from "@/assets/logo-myra.png";
import styles from "./Header.module.css";

export default function Header({ onMenu, onSearch, onCart, cartCount = 0 }) {
  const [solid, setSolid] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  return (
    <div className={styles.fixed}>
      {/* Top bar : nom centré */}
      <div className={`${styles.topbar} ${solid ? styles.topbarSolid : ""}`}>
        <span className={styles.topbarName}>Myra Skin Care</span>
      </div>

      {/* Barre principale */}
      <header className={`${styles.bar} ${solid ? styles.barSolid : ""}`}>
        {/* Gauche : menu (mobile) + logo + recherche */}
        <div className={styles.left}>
          <button onClick={onMenu} className={styles.burger} aria-label="Menu">
            <MenuIcon />
          </button>

          <Link to="/" className={styles.logo}>
            <img src={logo} alt="Myra Skin Care" />
          </Link>

          <div className={styles.searchDesktop}>
            <SearchIcon size={17} stroke="var(--color-grey)" />
            <input 
              placeholder="Rechercher un soin…" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <button onClick={onSearch} className={styles.searchMobile} aria-label="Rechercher">
            <SearchIcon size={23} />
          </button>
        </div>

        {/* Centre : navigation */}
        <nav className={styles.nav}>
          {NAV.map((item, i) => (
            <NavItem key={item.label} item={item} alignRight={i >= 6} />
          ))}
        </nav>

        {/* Droite : panier */}
        <div className={styles.right}>
          <button onClick={onCart} className={styles.cart} aria-label="Panier">
            <CartIcon />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>
        </div>
      </header>
    </div>
  );
}

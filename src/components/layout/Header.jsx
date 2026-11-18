import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNav } from "@/context/NavContext";
import NavItem from "./NavItem";
import RechercheRapide from "@/components/recherche/RechercheRapide";
import { SearchIcon, CartIcon, MenuIcon } from "@/components/ui/icons";
import logo from "@/assets/logo-myra.png";
import styles from "./Header.module.css";

export default function Header({ onMenu, onSearch, onCart, cartCount = 0 }) {
  const [solid, setSolid] = useState(false);
  const { nav } = useNav();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <RechercheRapide variante="entete" />
          </div>

          <button onClick={onSearch} className={styles.searchMobile} aria-label="Rechercher">
            <SearchIcon size={23} />
          </button>
        </div>

        {/* Centre : navigation */}
        <nav className={styles.nav}>
          {nav.map((item, i) => (
            <NavItem key={item.label} item={item} alignRight={i >= nav.length - 3} />
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

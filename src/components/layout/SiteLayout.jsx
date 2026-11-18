import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import SidePanel from "@/components/layout/SidePanel";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCart } from "@/context/CartContext";
import { NavProvider } from "@/context/NavContext";
import RechercheMobile from "@/components/recherche/RechercheMobile";

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [rechercheOuverte, setRechercheOuverte] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <NavProvider>
      <Header
        onMenu={() => setMenuOpen(true)}
        onSearch={() => setRechercheOuverte(true)}
        onCart={() => setIsCartOpen(true)}
        cartCount={cartCount}
      />
      <SidePanel open={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer />
      <RechercheMobile ouvert={rechercheOuverte} onFermer={() => setRechercheOuverte(false)} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </NavProvider>
  );
}

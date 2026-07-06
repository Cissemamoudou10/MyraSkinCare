import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import SidePanel from "@/components/layout/SidePanel";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCart } from "@/context/CartContext";

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <>
      <Header
        onMenu={() => setMenuOpen(true)}
        onSearch={() => {}}
        onCart={() => setIsCartOpen(true)}
        cartCount={cartCount}
      />
      <SidePanel open={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

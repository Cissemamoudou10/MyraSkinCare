import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "@/context/CartContext";
import SiteLayout from "@/components/layout/SiteLayout";
import Home from "@/pages/Home";
import Boutique from "@/pages/Boutique";
import Concerns from "@/pages/Concerns";
import Brands from "@/pages/Brands";
import Ingredients from "@/pages/Ingredients";
import Journal from "@/pages/Journal";
import Kits from "@/pages/Kits";
import KitDetail from "@/pages/KitDetail";
import ProductDetail from "@/pages/ProductDetail";
import Placeholder from "@/pages/Placeholder";
import Search from "@/pages/Search";
import Avis from "@/pages/Avis";

import AdminLayout from "@/admin/AdminLayout";
import Dashboard from "@/admin/pages/Dashboard";
import Products from "@/admin/pages/Products";
import ProductForm from "@/admin/pages/ProductForm";
import Orders from "@/admin/pages/Orders";
import ReferentialsAdmin from "@/admin/pages/ReferentialsAdmin";
import ReviewsAdmin from "@/admin/pages/ReviewsAdmin";
import ArticlesAdmin from "@/admin/pages/ArticlesAdmin";
import KitsAdmin from "@/admin/pages/KitsAdmin";
import KitForm from "@/admin/pages/KitForm";
import POS from "@/admin/pages/POS";
import Login from "@/admin/pages/Login";
import { AuthProvider } from "@/context/AuthContext";
import { ProductModalProvider } from "@/context/ProductModalContext";
import { DialogProvider } from "@/context/DialogContext";

export default function App() {
  return (
    <DialogProvider>
      <CartProvider>
        <ProductModalProvider>
          <AuthProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                {/* ---------- FRONT (vitrine) ---------- */}
                <Route element={<SiteLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/boutique" element={<Boutique />} />
                  <Route path="/preoccupations" element={<Concerns />} />
                  <Route path="/marques" element={<Brands />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/ingredients" element={<Ingredients />} />
                  <Route path="/nos-kits" element={<Kits />} />
                  <Route path="/nos-kits/:slug" element={<KitDetail />} />
                  <Route path="/produits/:slug" element={<ProductDetail />} />
                  <Route path="/recherche" element={<Search />} />
                  <Route path="/avis" element={<Avis />} />
                  <Route path="/contact" element={<Placeholder title="Contact" />} />
                  <Route path="/mentions-legales" element={<Placeholder title="Mentions Légales" subtitle="Page en cours de rédaction." />} />
                  <Route path="/cgv" element={<Placeholder title="Conditions Générales de Vente" subtitle="Page en cours de rédaction." />} />
                  <Route path="/confidentialite" element={<Placeholder title="Politique de Confidentialité" subtitle="Page en cours de rédaction." />} />
                  <Route path="/expeditions" element={<Placeholder title="Expéditions et Livraisons" subtitle="Page en cours de rédaction." />} />
                  <Route path="/retours" element={<Placeholder title="Politique de Retour" subtitle="Page en cours de rédaction." />} />
                  <Route path="*" element={<Placeholder title="Page introuvable" subtitle="Cette page n'existe pas ou a été déplacée." />} />
                </Route>

                {/* ---------- ADMIN (gestion) ---------- */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="produits" element={<Products />} />
                  <Route path="produits/:id" element={<ProductForm />} />
                  <Route path="commandes" element={<Orders />} />
                  <Route path="caisse" element={<POS />} />
                  <Route path="caracteristiques" element={<ReferentialsAdmin />} />
                  <Route path="journal" element={<ArticlesAdmin />} />
                  <Route path="kits" element={<KitsAdmin />} />
                  <Route path="kits/:id" element={<KitForm />} />
                  <Route path="avis" element={<ReviewsAdmin />} />
                  <Route path="parametres" element={<Placeholder title="Paramètres (admin)" subtitle="Réglages de la boutique à venir." />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ProductModalProvider>
      </CartProvider>
    </DialogProvider>
  );
}

import { useState } from "react";
import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Tags, Settings, LogOut, ArrowLeft, MessageSquare, BookOpen, Menu, X, Store } from "lucide-react";
import styles from "./AdminLayout.module.css";
import { useAuth } from "@/context/AuthContext";

const LINKS = [
  { to: "/admin", label: "Tableau de bord", end: true, icon: LayoutDashboard },
  { to: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { to: "/admin/caisse", label: "Caisse (POS)", icon: Store },
  { to: "/admin/produits", label: "Produits", icon: Package },
  { to: "/admin/kits", label: "Kits & Packs", icon: Package },
  { to: "/admin/caracteristiques", label: "Caractéristiques", icon: Tags },
  { to: "/admin/journal", label: "Journal", icon: BookOpen },
  { to: "/admin/avis", label: "Avis Clients", icon: MessageSquare },
  { to: "/admin/parametres", label: "Paramètres", icon: Settings },
];

const PRIMARY_LINKS = [
  { to: "/admin", label: "Dashboard", end: true, icon: LayoutDashboard },
  { to: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { to: "/admin/produits", label: "Produits", icon: Package },
];

export default function AdminLayout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className={styles.shell}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Myra</span>
          <span className={styles.brandSub}>Admin</span>
        </div>
      </header>

      {/* Desktop Sidebar / Drawer on Mobile */}
      <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            <span className={styles.brandName}>Myra</span>
            <span className={styles.brandSub}>Admin</span>
          </div>
          <button className={styles.closeMenuBtn} onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <l.icon size={16} strokeWidth={1.5} />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <button onClick={handleLogout} className={styles.back} style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", marginBottom: "1rem" }}>
            <LogOut size={14} style={{ marginRight: 8 }} />
            Se déconnecter
          </button>
          <a href="/" className={styles.back}>
            <ArrowLeft size={14} style={{ marginRight: 8 }} />
            Retour au site
          </a>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className={styles.bottomNav}>
        {PRIMARY_LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `${styles.bottomLink} ${isActive ? styles.activeBottom : ""}`
            }
          >
            <l.icon size={20} strokeWidth={1.5} />
            <span>{l.label}</span>
          </NavLink>
        ))}
        <button 
          className={`${styles.bottomLink} ${mobileMenuOpen ? styles.activeBottom : ""}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={20} strokeWidth={1.5} />
          <span>Menu</span>
        </button>
      </nav>

      {/* Overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div className={styles.overlay} onClick={() => setMobileMenuOpen(false)} />
      )}

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

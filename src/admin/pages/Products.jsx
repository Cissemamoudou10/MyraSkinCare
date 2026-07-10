import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAdminProduits } from "@/lib/api";
import { formatPrice } from "@/data/products";
import { Edit2, Plus, CheckCircle, XCircle, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { useDialog } from "@/context/DialogContext";
import { SkeletonRow } from "@/components/ui/Skeleton";
import styles from "./Products.module.css";

const getImgSrc = (photo) => {
  if (!photo) return "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=50&q=75";
  return photo.startsWith("http") ? photo : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4000'}${photo}`;
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminProduits()
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);


  const handleExportExcel = () => {
    try {
      const filtered = products.filter(p => p.nom.toLowerCase().includes(search.toLowerCase()));

      const dataToExport = filtered.map(p => ({
        "ID": p.id,
        "Nom du produit": p.nom,
        "Marque": p.marque?.nom || "-",
        "Catégorie": p.categorie?.nom || "-",
        "Prix (FCFA)": p.prix,
        "Stock": p.stock,
        "Statut": p.actif ? "Actif" : "Inactif"
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Produits");
      
      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `myra_produits_${dateStr}.xlsx`);
      
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'exportation Excel.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Produits</h1>
          <p className={styles.subtitle}>{products.length} produits au catalogue.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--color-line)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '13px', width: '250px' }}
          />
          <button 
            onClick={handleExportExcel}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: '8px 16px', background: 'var(--color-ink)', 
              color: 'var(--color-white)', border: 'none', borderRadius: '4px',
              fontFamily: 'var(--font-sans)', fontSize: '12px', textTransform: 'uppercase', 
              letterSpacing: '0.05em', cursor: 'pointer'
            }}
          >
            <Download size={14} /> Exporter (Excel)
          </button>
          <Link to="/admin/produits/nouveau" className={styles.btnAdd}>
            <Plus size={16} /> Ajouter
          </Link>
        </div>
      </header>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}></th>
                <th>Produit</th>
                <th>Marque</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Statut</th>
                <th className={styles.rightAlign}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <tr><td colSpan="7" style={{ padding: 0 }}><SkeletonRow /></td></tr>
                  <tr><td colSpan="7" style={{ padding: 0 }}><SkeletonRow /></td></tr>
                  <tr><td colSpan="7" style={{ padding: 0 }}><SkeletonRow /></td></tr>
                  <tr><td colSpan="7" style={{ padding: 0 }}><SkeletonRow /></td></tr>
                </>
              ) : products.filter(p => p.nom.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.empty}>Aucun produit trouvé.</td>
                </tr>
              ) : products.filter(p => p.nom.toLowerCase().includes(search.toLowerCase())).map((p) => (
                <tr key={p.id}>
                  <td data-label="Image">
                    <img src={getImgSrc(p.photo)} alt="" className={styles.thumb} />
                  </td>
                  <td data-label="Produit">
                    <Link to={`/admin/produits/${p.id}`} className={styles.productName} style={{ textDecoration: 'none', color: 'var(--color-ink)' }}>
                      {p.nom}
                    </Link>
                  </td>
                  <td data-label="Marque">{p.marque?.nom || "-"}</td>
                  <td className={styles.fw500} data-label="Prix">{formatPrice(p.prix)}</td>
                  <td data-label="Stock">
                    <span style={{ 
                      color: p.stock === 0 ? 'var(--color-red)' : p.stock < 5 ? 'var(--color-gold)' : 'var(--color-ink)',
                      fontWeight: p.stock < 5 ? '600' : '400'
                    }}>
                      {p.stock}
                    </span>
                  </td>
                  <td data-label="Statut">
                    {p.actif ? (
                      <span className={`${styles.badge} ${styles.badgeActive}`}><CheckCircle size={10} /> Actif</span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeInactive}`}><XCircle size={10} /> Inactif</span>
                    )}
                  </td>
                  <td className={styles.rightAlign} data-label="Actions">
                    <Link to={`/admin/produits/${p.id}`} className={styles.btnAction} title="Modifier le produit">
                      <Edit2 size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

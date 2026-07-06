import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAdminKits, supprimerKit } from "@/lib/api";
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Package, Eye } from "lucide-react";
import { useDialog } from "@/context/DialogContext";
import { SkeletonRow } from "@/components/ui/Skeleton";
import styles from "./Products.module.css";
import { formatPrice } from "@/data/products";

export default function KitsAdmin() {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedKit, setSelectedKit] = useState(null);
  const { confirm, addToast } = useDialog();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminKits();
      setKits(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = kits.filter(k => 
    k.nom.toLowerCase().includes(query.toLowerCase()) || 
    k.slug.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = async (id) => {
    const ok = await confirm("Voulez-vous vraiment supprimer ce kit ?");
    if (ok) {
      try {
        await supprimerKit(id);
        addToast("Kit supprimé.", "success");
        load();
      } catch (err) {
        addToast("Erreur lors de la suppression.", "error");
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Kits & Packs</h1>
          <p className={styles.subtitle}>{kits.length} kits disponibles.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Rechercher un kit..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--color-line)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '13px', width: '250px' }}
          />
          <Link to="/admin/kits/nouveau" className={styles.btnAdd}>
            <Plus size={16} /> Nouveau Kit
          </Link>
        </div>
      </header>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kit</th>
                <th>Produits inclus</th>
                <th>Prix</th>
                <th>Statut</th>
                <th className={styles.rightAlign}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <tr><td colSpan="5" style={{ padding: 0 }}><SkeletonRow /></td></tr>
                  <tr><td colSpan="5" style={{ padding: 0 }}><SkeletonRow /></td></tr>
                  <tr><td colSpan="5" style={{ padding: 0 }}><SkeletonRow /></td></tr>
                </>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className={styles.empty}>Aucun kit trouvé.</td></tr>
              ) : (
                filtered.map((k) => (
                  <tr key={k.id}>
                    <td data-label="Kit">
                      <Link to={`/admin/kits/${k.id}`} className={styles.productName} style={{ textDecoration: 'none', color: 'var(--color-ink)' }}>
                        {k.nom}
                      </Link>
                      <div style={{ fontSize: "11px", color: "var(--color-grey)", marginTop: "2px" }}>{k.slug}</div>
                    </td>
                    <td data-label="Produits">
                      <span style={{ fontSize: "12px", background: "#f5f5f5", border: "1px solid #e0e0e0", padding: "4px 8px", borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--color-ink)" }}>
                        <Package size={12} /> {k.produits ? k.produits.length : 0} articles
                      </span>
                    </td>
                    <td className={styles.fw500} data-label="Prix">
                      {k.prix.en_promo ? (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ color: '#d32f2f' }}>{formatPrice(k.prix.prix_final)}</span>
                          <span style={{ textDecoration: 'line-through', color: 'var(--color-grey)', fontSize: '11px' }}>{formatPrice(k.prix.prix_plein)} (-{k.prix.reduction_pourcentage}%)</span>
                        </div>
                      ) : (
                        <span>{formatPrice(k.prix.prix_plein)}</span>
                      )}
                    </td>
                    <td data-label="Statut">
                      {k.actif ? (
                        <span className={`${styles.badge} ${styles.badgeActive}`}><CheckCircle size={10} /> Actif</span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeInactive}`}><XCircle size={10} /> Inactif</span>
                      )}
                    </td>
                    <td className={styles.rightAlign} data-label="Actions">
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setSelectedKit(k)} className={styles.btnAction} title="Voir les détails">
                          <Eye size={14} />
                        </button>
                        <Link to={`/admin/kits/${k.id}`} className={styles.btnAction} title="Modifier">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(k.id)} className={styles.btnAction} style={{ color: 'var(--color-red)' }} title="Supprimer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedKit && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setSelectedKit(null)}>
          <div style={{ background: "white", padding: "32px", borderRadius: "8px", width: "90%", maxWidth: "500px", maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontFamily: "var(--font-serif)" }}>Détails du kit</h2>
              <button onClick={() => setSelectedKit(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><XCircle size={24} color="var(--color-grey)" /></button>
            </div>
            
            <div style={{ marginBottom: "16px" }}>
              <strong>Nom :</strong> {selectedKit.nom}
            </div>
            {selectedKit.description && (
              <div style={{ marginBottom: "16px", color: "var(--color-grey)", fontSize: "14px" }}>
                {selectedKit.description}
              </div>
            )}
            
            <div style={{ marginBottom: "16px", padding: "16px", background: "#f5f5f5", borderRadius: "4px" }}>
              <div style={{ marginBottom: "8px" }}><strong>Valeur réelle :</strong> {formatPrice(selectedKit.prix.prix_plein)}</div>
              {selectedKit.prix.en_promo && (
                <div style={{ color: "#d32f2f", fontWeight: "bold" }}>
                  <strong>Prix promo (-{selectedKit.prix.reduction_pourcentage}%) :</strong> {formatPrice(selectedKit.prix.prix_final)}
                </div>
              )}
            </div>

            <h3 style={{ fontSize: "16px", marginBottom: "16px", borderBottom: "1px solid var(--color-line)", paddingBottom: "8px" }}>Produits inclus ({selectedKit.produits?.length || 0})</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {selectedKit.produits?.map((p) => (
                <li key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--color-line)" }}>
                  <span style={{ fontSize: "14px" }}>{p.nom}</span>
                  <span style={{ fontSize: "12px", background: "#eee", padding: "2px 6px", borderRadius: "4px" }}>x{p.KitProduit?.quantite || 1}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

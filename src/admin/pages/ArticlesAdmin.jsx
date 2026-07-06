import { useState, useEffect } from "react";
import { fetchAdminArticles, creerArticle, modifierArticle, supprimerArticle } from "@/lib/api";
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useDialog } from "@/context/DialogContext";
import styles from "./Orders.module.css";
import s from "../admin.module.css";

export default function ArticlesAdmin() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const { confirm, addToast } = useDialog();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminArticles();
      setArticles(res.data || []);
    } catch (err) {
      console.error(err);
      addToast("Erreur lors du chargement des articles.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        titre: form.titre,
        type: form.type,
        contenu: form.contenu,
        image_url: form.image_url,
        publie: form.publie
      };
      
      if (form.id) {
        await modifierArticle(form.id, payload);
        addToast("Article mis à jour.", "success");
      } else {
        await creerArticle(payload);
        addToast("Article créé.", "success");
      }
      setForm(null);
      loadData();
    } catch (err) {
      addToast("Erreur lors de l'enregistrement.", "error");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm(`Voulez-vous vraiment supprimer cet article ?`);
    if (!ok) return;
    
    try {
      await supprimerArticle(id);
      addToast("Article supprimé.", "success");
      loadData();
    } catch (err) {
      addToast("Erreur lors de la suppression.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className={styles.title}>Journal (Articles)</h1>
          <p className={styles.subtitle}>Gérez les articles de conseils, ingrédients et rituels.</p>
        </div>
        <button 
          className={s.btn} 
          onClick={() => setForm({ titre: "", type: "conseil", contenu: "", image_url: "", publie: false })} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> Nouvel Article
        </button>
      </header>

      {form && (
        <div className={styles.card} style={{ marginBottom: "32px", padding: "24px", background: "rgba(250, 248, 244, 0.4)" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "24px", color: "var(--color-ink)" }}>
            {form.id ? "Modifier" : "Créer"} un article
          </h2>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-ink)" }}>
                  Titre de l'article
                </label>
                <input 
                  required 
                  value={form.titre} 
                  onChange={(e) => setForm({...form, titre: e.target.value})} 
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--color-line)", borderRadius: "4px", fontFamily: "var(--font-body)", fontSize: "14px" }}
                />
              </div>
              
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-ink)" }}>
                  Type
                </label>
                <select 
                  value={form.type} 
                  onChange={(e) => setForm({...form, type: e.target.value})} 
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--color-line)", borderRadius: "4px", fontFamily: "var(--font-body)", fontSize: "14px", appearance: "none", background: "var(--color-white)" }}
                >
                  <option value="conseil">Conseil</option>
                  <option value="ingredient">Ingrédient focus</option>
                  <option value="rituel">Rituel</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-ink)" }}>
                  Image URL (Unsplash etc.)
                </label>
                <input 
                  placeholder="https://..."
                  value={form.image_url || ""} 
                  onChange={(e) => setForm({...form, image_url: e.target.value})} 
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--color-line)", borderRadius: "4px", fontFamily: "var(--font-body)", fontSize: "14px" }}
                />
              </div>
              {form.image_url && (
                <div style={{ width: "45px", height: "45px", borderRadius: "4px", overflow: "hidden", flexShrink: 0, border: "1px solid var(--color-line)" }}>
                  <img src={form.image_url} alt="Aperçu" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-ink)" }}>
                Contenu de l'article
              </label>
              <textarea 
                required 
                value={form.contenu} 
                onChange={(e) => setForm({...form, contenu: e.target.value})} 
                style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--color-line)", borderRadius: "4px", fontFamily: "var(--font-body)", fontSize: "14px", minHeight: "200px", resize: "vertical" }}
              />
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--color-white)", padding: "16px", borderRadius: "4px", border: "1px solid var(--color-line)" }}>
              <input 
                type="checkbox" 
                id="publieCheck"
                checked={form.publie}
                onChange={(e) => setForm({...form, publie: e.target.checked})}
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              <label htmlFor="publieCheck" style={{ fontFamily: "var(--font-body)", fontSize: "14px", cursor: "pointer", userSelect: "none" }}>
                Publier cet article sur la vitrine (visible par les clients)
              </label>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button type="button" onClick={() => setForm(null)} style={{ padding: "12px 24px", background: "transparent", border: "1px solid var(--color-line)", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Annuler
              </button>
              <button type="submit" style={{ padding: "12px 24px", background: "var(--color-ink)", color: "var(--color-cream)", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Enregistrer l'article
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          {loading ? (
            <div className={styles.loading}>Chargement...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>Image</th>
                  <th>Titre</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th className={styles.rightAlign}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={styles.empty}>Aucun article trouvé.</td>
                  </tr>
                ) : articles.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.image_url ? (
                        <div style={{ width: "40px", height: "40px", borderRadius: "4px", overflow: "hidden" }}>
                          <img src={item.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div style={{ 
                          width: "40px", height: "40px", borderRadius: "4px", 
                          background: "linear-gradient(135deg, var(--color-cream) 0%, #e8e2d2 100%)",
                          border: "1px solid var(--color-line)"
                        }} />
                      )}
                    </td>
                    <td className={styles.fw500}>{item.titre}</td>
                    <td style={{ textTransform: "capitalize" }}>{item.type}</td>
                    <td>
                      {item.publie ? (
                         <span style={{ color: "var(--color-green)", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                           <CheckCircle size={12} /> Publié
                         </span>
                      ) : (
                         <span style={{ color: "var(--color-grey)", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                           <XCircle size={12} /> Brouillon
                         </span>
                      )}
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--color-grey)" }}>
                      {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className={styles.rightAlign}>
                      <div className={styles.actions}>
                        <button onClick={() => setForm(item)} className={styles.btnIcon} title="Modifier">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className={`${styles.btnIcon} ${styles.btnDanger}`} title="Supprimer" style={{ color: '#dc3545' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

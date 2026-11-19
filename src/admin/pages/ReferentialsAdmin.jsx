import Select from "@/components/ui/Select";
import { useState, useEffect } from "react";
import { 
  fetchAdminMarques, fetchAdminCategories, fetchAdminProblemes, 
  fetchAdminActifs, fetchAdminTypesPeau, fetchAdminTags,
  creerReferentiel, modifierReferentiel, supprimerReferentiel 
} from "@/lib/api";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useDialog } from "@/context/DialogContext";
import styles from "./Orders.module.css";
import s from "../admin.module.css";

const TABS = [
  { id: "categories", label: "Catégories", fetchFn: fetchAdminCategories },
  { id: "marques", label: "Marques", fetchFn: fetchAdminMarques },
  { id: "principes-actifs", label: "Principes Actifs", fetchFn: fetchAdminActifs },
  { id: "problemes", label: "Problèmes", fetchFn: fetchAdminProblemes },
  { id: "types-peau", label: "Types de Peau", fetchFn: fetchAdminTypesPeau },
  { id: "tags", label: "Tags", fetchFn: fetchAdminTags },
];

export default function ReferentialsAdmin() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const { confirm, addToast } = useDialog();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await activeTab.fetchFn();
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(null); // fermer le form si on change d'onglet
    loadData();
  }, [activeTab]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { nom: form.nom, description: form.description };
      if (activeTab.id !== "principes-actifs") {
        payload.image_url = form.image_url;
      }
      if (activeTab.id === "categories") {
        payload.parent_id = form.parent_id || null;
        payload.ordre = parseInt(form.ordre, 10) || 0;
        payload.affiche_menu = !!form.affiche_menu;
      }
      if (form.id) {
        await modifierReferentiel(activeTab.id, form.id, payload);
      } else {
        await creerReferentiel(activeTab.id, payload);
      }
      setForm(null);
      addToast(`${activeTab.label} sauvegardé avec succès.`, "success");
      loadData();
    } catch (err) {
      addToast("Erreur lors de l'enregistrement", "error");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm(`Voulez-vous vraiment supprimer cet élément de ${activeTab.label} ?`);
    if (!ok) return;
    
    try {
      await supprimerReferentiel(activeTab.id, id);
      addToast("Élément supprimé.", "success");
      loadData();
    } catch (err) {
      addToast("Impossible de supprimer (cet élément est sûrement lié à des produits).", "error");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className={styles.title}>Caractéristiques</h1>
          <p className={styles.subtitle}>Gérez les attributs associés à vos produits.</p>
        </div>
        <button className={s.btn} onClick={() => setForm({ nom: "", description: "", image_url: "", parent_id: "", ordre: 0, affiche_menu: true })} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Ajouter
        </button>
      </header>

      {/* TABS */}
      <div style={{ display: "flex", gap: "16px", borderBottom: "1px solid var(--color-line)", marginBottom: "24px", overflowX: "auto" }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              padding: "12px 16px",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: activeTab.id === tab.id ? "var(--color-ink)" : "var(--color-grey)",
              borderBottom: activeTab.id === tab.id ? "2px solid var(--color-ink)" : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {form && (
        <div className={styles.card} style={{ marginBottom: "32px", padding: "24px", background: "rgba(250, 248, 244, 0.4)" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "16px", color: "var(--color-ink)" }}>
            {form.id ? "Modifier" : "Ajouter"} un élément : {activeTab.label}
          </h2>
          <form onSubmit={handleSave} style={{ display: "flex", gap: "24px", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-ink)" }}>
                Nom
              </label>
              <input 
                required 
                value={form.nom} 
                onChange={(e) => setForm({...form, nom: e.target.value})} 
                style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--color-line)", fontFamily: "var(--font-body)", fontSize: "14px" }}
              />
            </div>
            {/* Seules les marques ont une description dans notre DB, mais on peut le garder optionnel ou le cacher pour les autres */}
            {activeTab.id === "marques" && (
              <div style={{ flex: 2 }}>
                <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-ink)" }}>
                  Description
                </label>
                <input 
                  value={form.description || ""} 
                  onChange={(e) => setForm({...form, description: e.target.value})} 
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--color-line)", fontFamily: "var(--font-body)", fontSize: "14px" }}
                />
              </div>
            )}

            {/* Champ image_url (optionnel) sauf pour principes-actifs */}
            {activeTab.id !== "principes-actifs" && (
              <div style={{ flex: 1.5, display: "flex", gap: "12px", alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-ink)" }}>
                    Image URL (Optionnel)
                  </label>
                  <input 
                    placeholder="https://..."
                    value={form.image_url || ""} 
                    onChange={(e) => setForm({...form, image_url: e.target.value})} 
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--color-line)", fontFamily: "var(--font-body)", fontSize: "14px" }}
                  />
                </div>
                {form.image_url && (
                  <div style={{ width: "45px", height: "45px", overflow: "hidden", flexShrink: 0, border: "1px solid var(--color-line)" }}>
                    <img src={form.image_url} alt="Aperçu" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>
            )}

            {activeTab.id === "categories" && (
              <>
                <div style={{ flex: 1.2 }}>
                  <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-ink)" }}>
                    Rubrique parente
                  </label>
                  <Select
                    value={form.parent_id || ""}
                    onChange={(v) => setForm({ ...form, parent_id: v })}
                    options={[
                      { value: "", label: "Aucune (rubrique principale)" },
                      ...data
                        .filter((c) => !c.parent_id && c.id !== form.id)
                        .map((c) => ({ value: c.id, label: c.nom })),
                    ]}
                  />
                </div>
                <div style={{ width: "90px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-ink)" }}>
                    Ordre
                  </label>
                  <input
                    type="number"
                    value={form.ordre ?? 0}
                    onChange={(e) => setForm({ ...form, ordre: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--color-line)", fontFamily: "var(--font-body)", fontSize: "14px" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "12px" }}>
                  <input
                    id="affiche_menu"
                    type="checkbox"
                    checked={form.affiche_menu !== false}
                    onChange={(e) => setForm({ ...form, affiche_menu: e.target.checked })}
                  />
                  <label htmlFor="affiche_menu" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--color-ink)" }}>
                    Afficher dans le menu
                  </label>
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" onClick={() => setForm(null)} style={{ padding: "12px 24px", background: "transparent", border: "1px solid var(--color-line)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Annuler
              </button>
              <button type="submit" style={{ padding: "12px 24px", background: "var(--color-ink)", color: "var(--color-cream)", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Enregistrer
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
                  {activeTab.id !== "principes-actifs" && <th style={{ width: "60px" }}>Illu.</th>}
                  <th>Nom</th>
                  {activeTab.id === "marques" && <th>Description</th>}
                  {activeTab.id === "categories" && <th>Rubrique parente</th>}
                  {activeTab.id === "categories" && <th style={{ width: "70px" }}>Ordre</th>}
                  {activeTab.id === "categories" && <th style={{ width: "90px" }}>Menu</th>}
                  <th className={styles.rightAlign}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="3" className={styles.empty}>Aucune donnée trouvée.</td>
                  </tr>
                ) : data.map((item) => (
                  <tr key={item.id}>
                    {activeTab.id !== "principes-actifs" && (
                      <td data-label="Illustration">
                        {item.image_url ? (
                          <div style={{ width: "32px", height: "32px", overflow: "hidden" }}>
                            <img src={item.image_url} alt={item.nom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        ) : (
                          <div style={{ 
                            width: "32px", height: "32px", 
                            background: "linear-gradient(135deg, var(--color-cream) 0%, #e8e2d2 100%)",
                            border: "1px solid var(--color-line)"
                          }} />
                        )}
                      </td>
                    )}
                    <td className={styles.fw500} data-label="Nom">{item.nom}</td>
                    {activeTab.id === "marques" && <td data-label="Description">{item.description || "-"}</td>}
                    {activeTab.id === "categories" && (
                      <td data-label="Rubrique parente">{data.find((c) => c.id === item.parent_id)?.nom || "—"}</td>
                    )}
                    {activeTab.id === "categories" && <td data-label="Ordre">{item.ordre ?? 0}</td>}
                    {activeTab.id === "categories" && (
                      <td data-label="Menu">{item.affiche_menu === false ? "Masqué" : "Visible"}</td>
                    )}
                    <td className={styles.rightAlign} data-label="Actions">
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

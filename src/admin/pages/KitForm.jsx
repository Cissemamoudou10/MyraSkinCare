import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchAdminKits, creerKit, modifierKit, fetchAdminProduits } from "@/lib/api";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import { useDialog } from "@/context/DialogContext";
import styles from "./ProductForm.module.css";
import s from "../admin.module.css";

const defaultForm = {
  nom: "",
  description: "",
  actif: true,
  reduction_pourcentage: 0,
  promo_active: false,
  promo_debut: "",
  promo_fin: "",
  produits: [] // [{ produit_id, quantite }]
};

export default function KitForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useDialog();
  const editing = id && id !== "nouveau";

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchInputs, setSearchInputs] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodRes = await fetchAdminProduits();
        setAllProducts(prodRes.data || []);

        if (editing) {
          const kitsRes = await fetchAdminKits();
          const existing = (kitsRes.data || []).find(k => k.id === parseInt(id));
          if (existing) {
            setForm({
              nom: existing.nom,
              description: existing.description || "",
              actif: existing.actif !== false,
              reduction_pourcentage: existing.reduction_pourcentage || 0,
              promo_active: existing.promo_active || false,
              promo_debut: existing.promo_debut ? existing.promo_debut.split('T')[0] : "",
              promo_fin: existing.promo_fin ? existing.promo_fin.split('T')[0] : "",
              produits: (existing.produits || []).map(p => ({
                produit_id: p.id,
                quantite: p.KitProduit ? p.KitProduit.quantite : 1
              }))
            });
          }
        }
      } catch (err) {
        addToast("Erreur lors du chargement.", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, editing]);

  const handleAddProduct = () => {
    setForm({ ...form, produits: [...form.produits, { produit_id: "", quantite: 1 }] });
  };

  const handleUpdateProduct = (index, field, value) => {
    const newProds = [...form.produits];
    newProds[index][field] = value;
    setForm({ ...form, produits: newProds });
  };

  const handleRemoveProduct = (index) => {
    const newProds = [...form.produits];
    newProds.splice(index, 1);
    setForm({ ...form, produits: newProds });
    const newSearchInputs = { ...searchInputs };
    delete newSearchInputs[index];
    setSearchInputs(newSearchInputs);
  };

  const calculerPrixApercu = () => {
    const prix_plein = form.produits.reduce((acc, p) => {
      if (!p.produit_id) return acc;
      const rp = allProducts.find(x => x.id === parseInt(p.produit_id));
      if (!rp) return acc;
      return acc + (rp.prix * (parseInt(p.quantite) || 1));
    }, 0);

    let prix_final = prix_plein;
    if (form.promo_active && form.reduction_pourcentage > 0) {
      prix_final = Math.round(prix_plein * (1 - form.reduction_pourcentage / 100));
    }

    return { prix_plein, prix_final };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Filtrer les produits vides
      const validProds = form.produits.filter(p => p.produit_id && p.quantite > 0);
      if (validProds.length === 0) {
        addToast("Veuillez ajouter au moins un produit au kit.", "error");
        setSaving(false);
        return;
      }

      const formData = new FormData();
      formData.append("nom", form.nom);
      formData.append("description", form.description);
      formData.append("actif", form.actif);
      formData.append("reduction_pourcentage", form.reduction_pourcentage);
      formData.append("promo_active", form.promo_active);
      if (form.promo_debut) formData.append("promo_debut", form.promo_debut);
      if (form.promo_fin) formData.append("promo_fin", form.promo_fin);
      
      formData.append("produits", JSON.stringify(validProds));

      if (editing) {
        await modifierKit(id, formData);
        addToast("Kit modifié.", "success");
      } else {
        await creerKit(formData);
        addToast("Kit créé.", "success");
      }
      navigate("/admin/kits");
    } catch (err) {
      console.error(err);
      addToast(err?.response?.data?.message || "Erreur lors de l'enregistrement", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  const apercu = calculerPrixApercu();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/admin/kits" className={s.btnGhost} style={{ padding: '8px' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className={styles.title}>{editing ? "Modifier le kit" : "Nouveau Kit"}</h1>
            <p className={styles.subtitle}>
              {editing ? "Ajustez les paramètres du kit." : "Créez un nouveau lot de produits."}
            </p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.formLayout}>
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Informations Générales</h2>
            
            <div className={styles.field}>
              <label className={styles.label}>Nom du kit</label>
              <input className={styles.input} required value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} placeholder="Ex: Routine Hydratation Intense" />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Description (optionnel)</label>
              <textarea className={styles.textarea} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Ex: Ce kit contient les essentiels pour une peau..." />
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Produits Inclus</h2>
            
            {form.produits.map((prod, index) => {
              const selectedProduct = allProducts.find(p => p.id === parseInt(prod.produit_id));
              const searchVal = searchInputs[index] !== undefined ? searchInputs[index] : (selectedProduct ? selectedProduct.nom : "");
              
              return (
                <div key={index} style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "flex-end" }}>
                  <div className={styles.field} style={{ flex: 2, position: "relative" }}>
                    <label className={styles.label}>Produit</label>
                    <input 
                      type="text"
                      className={styles.input}
                      placeholder="Rechercher un produit..."
                      value={searchVal}
                      onChange={e => {
                        setSearchInputs({ ...searchInputs, [index]: e.target.value });
                        handleUpdateProduct(index, "produit_id", "");
                      }}
                      onFocus={() => {
                        if (!searchInputs[index]) {
                           setSearchInputs({ ...searchInputs, [index]: "" });
                        }
                      }}
                      onBlur={() => {
                         // Délai pour permettre le clic sur un élément de la liste
                         setTimeout(() => {
                           if (!prod.produit_id && selectedProduct) {
                             setSearchInputs({ ...searchInputs, [index]: selectedProduct.nom });
                           } else if (!prod.produit_id) {
                             setSearchInputs({ ...searchInputs, [index]: undefined });
                           }
                         }, 200);
                      }}
                      required={!prod.produit_id}
                    />
                    
                    {/* Liste déroulante des résultats */}
                    {searchInputs[index] !== undefined && !prod.produit_id && (
                      <ul style={{ 
                        position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10, 
                        background: "white", border: "1px solid var(--color-line)", 
                        borderRadius: "4px", maxHeight: "200px", overflowY: "auto", 
                        listStyle: "none", padding: 0, margin: "4px 0 0 0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                      }}>
                        {allProducts
                          .filter(p => p.nom.toLowerCase().includes((searchInputs[index] || "").toLowerCase()))
                          .map(p => (
                            <li 
                              key={p.id} 
                              onClick={() => {
                                handleUpdateProduct(index, "produit_id", p.id);
                                setSearchInputs({ ...searchInputs, [index]: p.nom });
                              }}
                              style={{ padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid var(--color-line)", fontSize: "13px" }}
                              onMouseEnter={e => e.target.style.background = "#f5f5f5"}
                              onMouseLeave={e => e.target.style.background = "white"}
                            >
                              <div style={{ fontWeight: "500" }}>{p.nom}</div>
                              <div style={{ fontSize: "11px", color: "var(--color-grey)" }}>{p.prix} FCFA • Stock: {p.stock}</div>
                            </li>
                          ))
                        }
                        {allProducts.filter(p => p.nom.toLowerCase().includes((searchInputs[index] || "").toLowerCase())).length === 0 && (
                          <li style={{ padding: "8px 12px", fontSize: "13px", color: "var(--color-grey)" }}>Aucun produit trouvé.</li>
                        )}
                      </ul>
                    )}
                  </div>
                  
                  <div className={styles.field} style={{ flex: 1 }}>
                    <label className={styles.label}>Quantité</label>
                    <input 
                      type="number" min="1" 
                      value={prod.quantite} 
                      className={styles.input}
                      onChange={e => handleUpdateProduct(index, "quantite", e.target.value)}
                      required
                    />
                  </div>
                  <button type="button" onClick={() => handleRemoveProduct(index)} style={{ padding: "12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}

            <button type="button" onClick={handleAddProduct} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "1px dashed var(--color-grey)", padding: "12px", width: "100%", justifyContent: "center", borderRadius: "4px", cursor: "pointer", marginTop: "16px", color: "var(--color-ink)" }}>
              <Plus size={16} /> Ajouter un produit au kit
            </button>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Promotion</h2>
            <p style={{ fontSize: "12px", color: "var(--color-grey)", marginBottom: "16px" }}>Appliquez une réduction au prix total des produits inclus.</p>

            <label className={styles.checkboxItem} style={{ marginBottom: "16px", fontWeight: "bold" }}>
              <input type="checkbox" checked={form.promo_active} onChange={e => setForm({...form, promo_active: e.target.checked})} />
              Activer la promotion sur ce kit
            </label>

            {form.promo_active && (
              <div style={{ background: "#f9f9f9", padding: "16px", borderRadius: "8px" }}>
                <div className={styles.field}>
                  <label className={styles.label}>Réduction (%)</label>
                  <input className={styles.input} type="number" min="0" max="100" value={form.reduction_pourcentage} onChange={e => setForm({...form, reduction_pourcentage: e.target.value})} required />
                </div>
                
                <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                  <div className={styles.field} style={{ flex: 1 }}>
                    <label className={styles.label}>Début promo (Optionnel)</label>
                    <input className={styles.input} type="date" value={form.promo_debut} onChange={e => setForm({...form, promo_debut: e.target.value})} />
                  </div>
                  <div className={styles.field} style={{ flex: 1 }}>
                    <label className={styles.label}>Fin promo (Optionnel)</label>
                    <input className={styles.input} type="date" value={form.promo_fin} onChange={e => setForm({...form, promo_fin: e.target.value})} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>Aperçu du prix</h3>
            <div style={{ padding: "16px", background: "var(--color-cream)", borderRadius: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "var(--color-grey)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Valeur réelle</div>
              <div style={{ fontSize: "18px", textDecoration: form.promo_active && form.reduction_pourcentage > 0 ? "line-through" : "none", color: "var(--color-grey)" }}>
                {apercu.prix_plein} FCFA
              </div>
              
              {form.promo_active && form.reduction_pourcentage > 0 && (
                <>
                  <div style={{ fontSize: "12px", color: "#d32f2f", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "16px", marginBottom: "8px" }}>Prix final (-{form.reduction_pourcentage}%)</div>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#d32f2f" }}>
                    {apercu.prix_final} FCFA
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className={styles.sectionTitle} style={{ margin: 0 }}>Statut</h3>
              <label className={styles.switch}>
                <input type="checkbox" checked={form.actif} onChange={e => setForm({...form, actif: e.target.checked})} />
                <span className={styles.slider}></span>
              </label>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-grey)' }}>
              {form.actif ? "Le kit est visible." : "Le kit est masqué."}
            </p>
          </div>

          <div className={styles.actions}>
            <Link to="/admin/kits" className={styles.btnCancel}>Annuler</Link>
            <Button type="submit" variant="solid" isLoading={saving}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Save size={16} strokeWidth={1.5} /> Enregistrer
              </span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

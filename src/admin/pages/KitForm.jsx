import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchAdminKits, creerKit, modifierKit, fetchAdminProduits } from "@/lib/api";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Select from "@/components/ui/Select";
import { formatPrice } from "@/data/products";
import k from "./KitForm.module.css";
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
  };

  const optionsProduits = allProducts.map((p) => ({
    value: p.id,
    label: p.marque ? `${p.nom} · ${p.marque.nom}` : p.nom,
  }));

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
            <h1 className={styles.title}>{editing ? "Modifier le kit" : "Nouveau kit"}</h1>
            <p className={styles.subtitle}>
              {editing ? "Ajustez les paramètres du kit." : "Créez un nouveau lot de produits."}
            </p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.formLayout}>
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Informations générales</h2>
            
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
            <h2 className={styles.sectionTitle}>Produits inclus</h2>
            
            {form.produits.length === 0 && <p className={k.texte}>Aucun produit dans ce kit pour l'instant.</p>}
            {form.produits.map((prod, index) => (
              <div key={index} className={k.ligneProduit}>
                <div className={styles.field}>
                  <label className={styles.label}>Produit</label>
                  <Select
                    recherche
                    required
                    placeholder="Choisir un produit…"
                    value={prod.produit_id}
                    onChange={(v) => handleUpdateProduct(index, "produit_id", v)}
                    options={optionsProduits}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Quantité</label>
                  <input
                    type="number"
                    min="1"
                    className={styles.input}
                    value={prod.quantite}
                    onChange={(e) => handleUpdateProduct(index, "quantite", e.target.value)}
                    required
                  />
                </div>
                <button type="button" className={k.retirer} onClick={() => handleRemoveProduct(index)} aria-label="Retirer ce produit">
                  <Trash2 size={15} strokeWidth={1.5} />
                </button>
              </div>
            ))}

            <button type="button" className={k.ajouterProduit} onClick={handleAddProduct}>
              <Plus size={14} strokeWidth={1.5} /> Ajouter un produit
            </button>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Promotion</h2>
            <p className={k.texte}>Appliquez une réduction au prix total des produits inclus.</p>

            <label className={styles.checkboxItem}>
              <input type="checkbox" checked={form.promo_active} onChange={e => setForm({...form, promo_active: e.target.checked})} />
              Activer la promotion sur ce kit
            </label>

            {form.promo_active && (
              <div className={k.promo}>
                <div className={styles.field}>
                  <label className={styles.label}>Réduction (%)</label>
                  <input className={styles.input} type="number" min="0" max="100" value={form.reduction_pourcentage} onChange={e => setForm({...form, reduction_pourcentage: e.target.value})} required />
                </div>
                
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label className={styles.label}>Début (optionnel)</label>
                    <input className={styles.input} type="date" value={form.promo_debut} onChange={e => setForm({...form, promo_debut: e.target.value})} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Fin (optionnel)</label>
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
            <div className={k.apercu}>
              <p className={k.apercuLabel}>Valeur des produits</p>
              <p className={form.promo_active && form.reduction_pourcentage > 0 ? k.prixBarre : k.prix}>
                {formatPrice(apercu.prix_plein)}
              </p>
              {form.promo_active && form.reduction_pourcentage > 0 && (
                <>
                  <p className={k.apercuLabel}>Prix du kit (−{form.reduction_pourcentage} %)</p>
                  <p className={k.prix}>{formatPrice(apercu.prix_final)}</p>
                </>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div className={k.statut}>
              <h3 className={styles.sectionTitle}>Statut</h3>
              <label className={styles.switch}>
                <input type="checkbox" checked={form.actif} onChange={e => setForm({...form, actif: e.target.checked})} />
                <span className={styles.slider}></span>
              </label>
            </div>
            <p className={k.texte}>
              {form.actif ? "Le kit est visible." : "Le kit est masqué."}
            </p>
          </div>

          <div className={styles.actions}>
            <Link to="/admin/kits" className={styles.btnCancel}>Annuler</Link>
            <button type="submit" className={styles.btnSubmit} disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

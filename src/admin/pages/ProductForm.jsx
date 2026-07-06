import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { fetchAdminProduits, creerProduit, modifierProduit, fetchAdminCategories, fetchAdminMarques, fetchAdminActifs, fetchAdminProblemes, fetchAdminTypesPeau, fetchAdminTags } from "@/lib/api";
import { ArrowLeft, Save, Image as ImageIcon, UploadCloud } from "lucide-react";
import { useDialog } from "@/context/DialogContext";
import Button from "@/components/ui/Button";
import styles from "./ProductForm.module.css";

const EMPTY = { 
  nom: "", 
  categorie_id: "", 
  marque_id: "", 
  prix: "", 
  stock: 0,
  description: "",
  actif: true,
  principes_actifs: [],
  problemes: [],
  types_peau: [],
  tags: []
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = id && id !== "nouveau";

  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { addToast } = useDialog();

  const [categories, setCategories] = useState([]);
  const [marques, setMarques] = useState([]);
  const [actifsList, setActifsList] = useState([]);
  const [problemesList, setProblemesList] = useState([]);
  const [typesPeauList, setTypesPeauList] = useState([]);
  const [tagsList, setTagsList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsRes, marquesRes, actifsRes, probsRes, tpRes, tagsRes] = await Promise.all([
          fetchAdminCategories(),
          fetchAdminMarques(),
          fetchAdminActifs(),
          fetchAdminProblemes(),
          fetchAdminTypesPeau(),
          fetchAdminTags()
        ]);
        setCategories(catsRes.data || []);
        setMarques(marquesRes.data || []);
        setActifsList(actifsRes.data || []);
        setProblemesList(probsRes.data || []);
        setTypesPeauList(tpRes.data || []);
        setTagsList(tagsRes.data || []);

        if (editing) {
          const prodsRes = await fetchAdminProduits();
          const existing = (prodsRes.data || []).find((p) => String(p.id) === String(id));
          if (existing) {
            setForm({
              nom: existing.nom || "",
              categorie_id: existing.categorie_id || "",
              marque_id: existing.marque_id || "",
              prix: existing.prix || "",
              stock: existing.stock || 0,
              description: existing.description || "",
              actif: existing.actif !== false,
              principes_actifs: (existing.principes_actifs || []).map(a => a.id),
              problemes: (existing.problemes || []).map(p => p.id),
              types_peau: (existing.types_peau || []).map(t => t.id),
              tags: (existing.tags || []).map(tag => tag.id)
            });
            if (existing.photo) {
              setPreview(existing.photo.startsWith("http") ? existing.photo : `http://localhost:4000${existing.photo}`);
            }
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, editing]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleCheckbox = (listName, id) => {
    setForm(prev => {
      const currentList = prev[listName];
      if (currentList.includes(id)) {
        return { ...prev, [listName]: currentList.filter(x => x !== id) };
      } else {
        return { ...prev, [listName]: [...currentList, id] };
      }
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData();
    formData.append("nom", form.nom);
    formData.append("description", form.description);
    formData.append("prix", form.prix);
    formData.append("stock", form.stock);
    formData.append("actif", form.actif);
    
    if (form.categorie_id) formData.append("categorie_id", form.categorie_id);
    if (form.marque_id) formData.append("marque_id", form.marque_id);
    
    // Le backend (produit.controller.js) parse les JSON strings
    formData.append("principes_actifs", JSON.stringify(form.principes_actifs));
    formData.append("problemes", JSON.stringify(form.problemes));
    formData.append("types_peau", JSON.stringify(form.types_peau));
    formData.append("tags", JSON.stringify(form.tags));

    if (file) formData.append("photo", file);

    try {
      if (editing) {
        await modifierProduit(id, formData);
        addToast("Produit modifié avec succès", "success");
      } else {
        await creerProduit(formData);
        addToast("Produit créé avec succès", "success");
      }
      navigate("/admin/produits");
    } catch (err) {
      console.error("Erreur d'enregistrement", err);
      addToast(err?.response?.data?.message || "Erreur lors de l'enregistrement du produit.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Chargement du formulaire...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/admin/produits" className={styles.backLink}>
          <ArrowLeft size={14} /> Retour au catalogue
        </Link>
        <h1 className={styles.title}>
          {editing ? "Modifier le produit" : "Ajouter un produit"}
        </h1>
        <p className={styles.subtitle}>
          Renseignez toutes les informations et relations du produit.
        </p>
      </header>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <div className={styles.field}>
            <label className={styles.label}>Nom du produit</label>
            <input className={styles.input} value={form.nom} onChange={set("nom")} required placeholder="Sérum éclat à la vitamine C..." />
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label}>Catégorie</label>
              <select className={styles.select} value={form.categorie_id} onChange={set("categorie_id")} required>
                <option value="">Sélectionnez...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Marque</label>
              <select className={styles.select} value={form.marque_id} onChange={set("marque_id")} required>
                <option value="">Sélectionnez...</option>
                {marques.map((m) => (
                  <option key={m.id} value={m.id}>{m.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label}>Prix (FCFA)</label>
              <input className={styles.input} type="number" value={form.prix} onChange={set("prix")} required placeholder="Ex: 15000" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Stock disponible</label>
              <input className={styles.input} type="number" value={form.stock} onChange={set("stock")} required placeholder="Ex: 50" min="0" />
            </div>
          </div>
          
          <div className={styles.field}>
            <label className={styles.checkboxItem}>
              <input 
                type="checkbox" 
                checked={form.actif} 
                onChange={(e) => setForm({...form, actif: e.target.checked})}
              />
              Produit Actif (visible sur le site)
            </label>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea className={styles.textarea} value={form.description} onChange={set("description")} placeholder="Décrivez le produit, son usage..." />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Photo (Miniature)</label>
            <div 
              className={styles.uploadZone} 
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Aperçu" className={styles.uploadPreview} />
                  <div className={styles.uploadOverlay}>Changer l'image</div>
                </>
              ) : (
                <>
                  <UploadCloud size={32} color="var(--color-ink-soft)" />
                  <span className={styles.uploadText}>Cliquez pour choisir une photo</span>
                </>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* RELATIONS MANY-TO-MANY */}
          <div style={{ marginTop: '16px' }}>
            <h3 className={styles.sectionTitle}>Principes Actifs</h3>
            <div className={styles.checkboxGrid}>
              {actifsList.map(a => (
                <label key={a.id} className={styles.checkboxItem}>
                  <input type="checkbox" checked={form.principes_actifs.includes(a.id)} onChange={() => handleCheckbox('principes_actifs', a.id)} />
                  {a.nom}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h3 className={styles.sectionTitle}>Problèmes ciblés</h3>
            <div className={styles.checkboxGrid}>
              {problemesList.map(p => (
                <label key={p.id} className={styles.checkboxItem}>
                  <input type="checkbox" checked={form.problemes.includes(p.id)} onChange={() => handleCheckbox('problemes', p.id)} />
                  {p.nom}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h3 className={styles.sectionTitle}>Types de peau</h3>
            <div className={styles.checkboxGrid}>
              {typesPeauList.map(t => (
                <label key={t.id} className={styles.checkboxItem}>
                  <input type="checkbox" checked={form.types_peau.includes(t.id)} onChange={() => handleCheckbox('types_peau', t.id)} />
                  {t.nom}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h3 className={styles.sectionTitle}>Tags (Étiquettes)</h3>
            <div className={styles.checkboxGrid}>
              {tagsList.map(t => (
                <label key={t.id} className={styles.checkboxItem}>
                  <input type="checkbox" checked={form.tags.includes(t.id)} onChange={() => handleCheckbox('tags', t.id)} />
                  {t.nom}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <Link to="/admin/produits" className={styles.btnCancel}>Annuler</Link>
            <Button type="submit" variant="solid" isLoading={saving}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Save size={14} strokeWidth={1.5} />
                {editing ? "Mettre à jour" : "Créer le produit"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

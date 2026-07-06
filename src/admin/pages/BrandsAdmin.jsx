import { useState, useEffect } from "react";
import { fetchAdminMarques, creerMarque, modifierMarque, supprimerMarque } from "@/lib/api";
import s from "../admin.module.css";

export default function BrandsAdmin() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminMarques();
      setBrands(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await modifierMarque(form.id, { nom: form.nom, description: form.description });
      } else {
        await creerMarque({ nom: form.nom, description: form.description });
      }
      setForm(null);
      loadBrands();
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette marque ?")) return;
    try {
      await supprimerMarque(id);
      loadBrands();
    } catch (err) {
      alert("Impossible de supprimer cette marque (peut-être des produits y sont associés).");
    }
  };

  return (
    <div>
      <div className={s.row}>
        <div>
          <h1 className={s.pageTitle}>Marques partenaires</h1>
          <p className={s.pageSub}>Gérez les marques affichées sur la boutique.</p>
        </div>
        <button className={s.btn} onClick={() => setForm({ nom: "", description: "" })}>
          + Ajouter une marque
        </button>
      </div>

      {form && (
        <div style={{ background: "#f9f9f9", padding: "1.5rem", borderRadius: "10px", marginBottom: "2rem" }}>
          <h2>{form.id ? "Modifier la marque" : "Nouvelle marque"}</h2>
          <form onSubmit={handleSave} style={{ display: "flex", gap: "1rem", alignItems: "flex-end", marginTop: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Nom</label>
              <input 
                required 
                value={form.nom} 
                onChange={(e) => setForm({...form, nom: e.target.value})} 
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Description</label>
              <input 
                value={form.description} 
                onChange={(e) => setForm({...form, description: e.target.value})} 
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <button type="submit" className={s.btn}>Enregistrer</button>
            <button type="button" className={`${s.btn} ${s.btnGhost}`} onClick={() => setForm(null)}>Annuler</button>
          </form>
        </div>
      )}

      {loading ? <p>Chargement...</p> : (
        <table className={s.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.nom}</td>
                <td>{b.description || "-"}</td>
                <td>
                  <div className={s.actions}>
                    <button onClick={() => setForm(b)} className={`${s.btn} ${s.btnGhost} ${s.btnSmall}`}>Modifier</button>
                    <button onClick={() => handleDelete(b.id)} className={`${s.btn} ${s.btnGhost} ${s.btnSmall}`} style={{ color: "red" }}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

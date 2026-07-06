import { useState, useEffect } from "react";
import { fetchAvis, soumettreAvis } from "@/lib/api";

export default function Avis() {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nom_client: "", email: "", note: 5, commentaire: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAvis()
      .then(res => setAvis(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await soumettreAvis(form);
      setSuccess(true);
      setForm({ nom_client: "", email: "", note: 5, commentaire: "" });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de votre avis. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "120px 5% 5%", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Avis Clients</h1>
      <p style={{ color: "var(--color-grey)", marginBottom: "3rem" }}>
        Découvrez ce que nos clients pensent de nos soins et partagez votre propre expérience.
      </p>

      <div style={{ marginBottom: "4rem", background: "#f9f9f9", padding: "2rem", borderRadius: "10px" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Laissez votre avis</h2>
        {success ? (
          <div style={{ color: "green", padding: "1rem", border: "1px solid green", borderRadius: "5px" }}>
            Merci pour votre avis ! Il sera visible très bientôt après validation.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Nom *</label>
                <input 
                  required 
                  value={form.nom_client} 
                  onChange={(e) => setForm({...form, nom_client: e.target.value})} 
                  style={{ width: "100%", padding: "0.8rem", border: "1px solid #ddd" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Email (ne sera pas publié) *</label>
                <input 
                  required 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({...form, email: e.target.value})} 
                  style={{ width: "100%", padding: "0.8rem", border: "1px solid #ddd" }}
                />
              </div>
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Note sur 5 *</label>
              <select 
                value={form.note} 
                onChange={(e) => setForm({...form, note: parseInt(e.target.value)})}
                style={{ width: "100%", padding: "0.8rem", border: "1px solid #ddd" }}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Très bien</option>
                <option value="3">3 - Bien</option>
                <option value="2">2 - Moyen</option>
                <option value="1">1 - Décevant</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Votre avis *</label>
              <textarea 
                required 
                rows="4" 
                value={form.commentaire} 
                onChange={(e) => setForm({...form, commentaire: e.target.value})} 
                style={{ width: "100%", padding: "0.8rem", border: "1px solid #ddd", fontFamily: "inherit" }}
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              style={{ padding: "1rem 2rem", background: "var(--color-ink)", color: "white", border: "none", cursor: submitting ? "not-allowed" : "pointer" }}
            >
              {submitting ? "Envoi en cours..." : "Soumettre mon avis"}
            </button>
          </form>
        )}
      </div>

      <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Avis récents</h2>
      {loading ? (
        <p>Chargement des avis...</p>
      ) : avis.length === 0 ? (
        <p>Aucun avis publié pour le moment. Soyez le premier !</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {avis.map(a => (
            <div key={a.id} style={{ borderBottom: "1px solid #eee", paddingBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <strong>{a.nom_client}</strong>
                <span style={{ color: "gold", fontSize: "1.2rem" }}>
                  {"★".repeat(a.note)}{"☆".repeat(5 - a.note)}
                </span>
              </div>
              <p style={{ fontStyle: "italic", color: "var(--color-grey)", lineHeight: "1.6" }}>
                « {a.commentaire} »
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { fetchAdminAvis, publierAvisAdmin, rejeterAvisAdmin } from "@/lib/api";
import { CheckCircle, XCircle, MessageSquare, Star } from "lucide-react";
import { useDialog } from "@/context/DialogContext";
import styles from "./Orders.module.css";

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useDialog();

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminAvis();
      setReviews(res.data || []);
    } catch (err) {
      console.error("Erreur chargement avis", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'publier') {
        await publierAvisAdmin(id);
        addToast("Avis publié avec succès.", "success");
      }
      if (action === 'rejeter') {
        await rejeterAvisAdmin(id);
        addToast("Avis rejeté.", "warning");
      }
      loadReviews(); 
    } catch (err) {
      console.error("Erreur lors de l'action sur l'avis", err);
      addToast("Erreur lors de la mise à jour de l'avis.", "error");
    }
  };

  const getStatusDisplay = (statut) => {
    switch (statut) {
      case "en_attente":
        return <span className={`${styles.badge} ${styles.badgeWait}`}><MessageSquare size={12} /> en attente</span>;
      case "publie":
        return <span className={`${styles.badge} ${styles.badgeGreen}`}><CheckCircle size={12} /> publié</span>;
      case "rejete":
        return <span className={`${styles.badge} ${styles.badgeRed}`}><XCircle size={12} /> rejeté</span>;
      default:
        return <span className={styles.badge}>{statut}</span>;
    }
  };

  const renderStars = (note) => {
    return (
      <div style={{ display: 'flex', gap: '2px', color: 'var(--color-gold)' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} size={14} fill={i <= note ? "currentColor" : "none"} />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className={styles.loading}>Chargement des avis...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Modération des Avis</h1>
        <p className={styles.subtitle}>{reviews.length} avis reçus.</p>
      </header>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Auteur</th>
                <th>Note</th>
                <th>Commentaire</th>
                <th>Produit</th>
                <th>Statut</th>
                <th className={styles.rightAlign}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.empty}>Aucun avis à afficher.</td>
                </tr>
              ) : reviews.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className={styles.clientInfo}>
                      <span className={styles.clientName}>{a.nom}</span>
                      <span className={styles.clientContact}>{new Date(a.created_at).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </td>
                  <td>{renderStars(a.note)}</td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'normal', lineHeight: '1.4' }}>
                    "{a.texte}"
                  </td>
                  <td>{a.commande?.lignes?.[0]?.produit?.nom || "Achat vérifié"}</td>
                  <td>{getStatusDisplay(a.statut)}</td>
                  <td className={styles.rightAlign}>
                    <div className={styles.actions}>
                      {a.statut === "en_attente" && (
                        <>
                          <button onClick={() => handleAction(a.id, 'publier')} className={styles.btnAction} title="Publier sur le site">
                            <CheckCircle size={16} />
                          </button>
                          <button onClick={() => handleAction(a.id, 'rejeter')} className={`${styles.btnAction} ${styles.btnDanger}`} title="Rejeter">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
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

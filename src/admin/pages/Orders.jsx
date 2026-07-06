import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCommandes, annulerCommande, livrerCommande, validerCommandeAdmin, marquerLivreeCommande } from "@/lib/api";
import { formatPrice } from "@/data/products";
import { CheckCircle, Truck, XCircle, CreditCard, Clock, MoreHorizontal, Download } from "lucide-react";
import { useDialog } from "@/context/DialogContext";
import { SkeletonRow } from "@/components/ui/Skeleton";
import * as XLSX from "xlsx";
import styles from "./Orders.module.css";

const getWhatsappLink = (number) => {
  if (!number) return "#";
  let cleanNumber = number.replace(/\D/g, ''); // enlever espaces, signes, etc.
  if (cleanNumber.length === 8) {
    cleanNumber = '223' + cleanNumber; // Ajouter indicatif Mali par défaut
  }
  return `https://wa.me/${cleanNumber}`;
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { confirm, addToast } = useDialog();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetchCommandes();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Erreur chargement commandes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleAction = async (id, action) => {
    if (action === 'annuler') {
      const ok = await confirm(`Êtes-vous sûr de vouloir annuler la commande n°${id} ?`);
      if (!ok) return;
    }

    try {
      if (action === 'valider') {
        await validerCommandeAdmin(id);
        addToast(`Commande ${id} validée.`, "success");
      }
      if (action === 'livrer') {
        await livrerCommande(id);
        addToast(`Commande ${id} expédiée.`, "success");
      }
      if (action === 'livree') {
        await marquerLivreeCommande(id);
        addToast(`Commande ${id} marquée comme livrée.`, "success");
      }
      if (action === 'annuler') {
        await annulerCommande(id);
        addToast(`Commande ${id} annulée.`, "warning");
      }
      loadOrders(); 
    } catch (err) {
      console.error("Erreur lors de l'action sur la commande", err);
      addToast(err?.response?.data?.message || "Erreur lors de la mise à jour de la commande.", "error");
    }
  };

  const handleExportExcel = () => {
    try {
      const filtered = orders.filter(o => 
        (o.prenom + " " + o.nom).toLowerCase().includes(search.toLowerCase()) || 
        o.whatsapp.includes(search) || 
        o.numero.toLowerCase().includes(search.toLowerCase())
      );

      const dataToExport = filtered.map(o => ({
        "N° Commande": o.numero,
        "Date": new Date(o.createdAt || o.created_at).toLocaleDateString("fr-FR"),
        "Client": `${o.prenom} ${o.nom}`,
        "WhatsApp": o.whatsapp,
        "Quartier": o.quartier,
        "Total (FCFA)": o.total,
        "Statut": o.statut,
        "Nombre d'articles": o.lignes?.reduce((acc, l) => acc + l.quantite, 0) || 0
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Commandes");
      
      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `myra_commandes_${dateStr}.xlsx`);
      
      addToast("Exportation Excel réussie !", "success");
    } catch (err) {
      console.error(err);
      addToast("Erreur lors de l'exportation.", "error");
    }
  };

  const getStatusDisplay = (statut) => {
    switch (statut) {
      case "en_attente_paiement":
      case "paiement_signale":
        return <span className={`${styles.badge} ${styles.badgeWait}`}><Clock size={12} /> {statut.replace(/_/g, " ")}</span>;
      case "payee":
        return <span className={`${styles.badge} ${styles.badgeGold}`}><CreditCard size={12} /> payée</span>;
      case "en_livraison":
        return <span className={`${styles.badge} ${styles.badgeGreen}`}><Truck size={12} /> en livraison</span>;
      case "livree":
        return <span className={`${styles.badge} ${styles.badgeGreen}`}><CheckCircle size={12} /> livrée</span>;
      case "annulee":
      case "expiree":
        return <span className={`${styles.badge} ${styles.badgeRed}`}><XCircle size={12} /> {statut === 'annulee' ? 'annulée' : 'expirée'}</span>;
      default:
        return <span className={styles.badge}>{statut?.replace(/_/g, " ") || "-"}</span>;
    }
  };


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Commandes</h1>
          <p className={styles.subtitle}>{orders.length} commande(s) dans le système.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Rechercher (Nom, WhatsApp, N°)..." 
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
        </div>
      </header>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Commande</th>
                <th>Client</th>
                <th>Date</th>
                <th>Articles</th>
                <th>Total</th>
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
                  <tr><td colSpan="7" style={{ padding: 0 }}><SkeletonRow /></td></tr>
                </>
              ) : orders.filter(o => 
                (o.prenom + " " + o.nom).toLowerCase().includes(search.toLowerCase()) || 
                o.whatsapp.includes(search) || 
                o.numero.toLowerCase().includes(search.toLowerCase())
              ).length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.empty}>Aucune commande trouvée.</td>
                </tr>
              ) : orders.filter(o => 
                (o.prenom + " " + o.nom).toLowerCase().includes(search.toLowerCase()) || 
                o.whatsapp.includes(search) || 
                o.numero.toLowerCase().includes(search.toLowerCase())
              ).map((o) => (
                <tr key={o.id}>
                  <td className={styles.fw500} data-label="Commande">
                    {o.numero}
                    {o.source === 'boutique' && (
                      <span style={{ fontSize: '9px', backgroundColor: 'var(--color-gold)', color: 'white', padding: '2px 4px', borderRadius: '4px', marginLeft: '6px', verticalAlign: 'middle', textTransform: 'uppercase' }}>POS</span>
                    )}
                  </td>
                  <td data-label="Client">
                    <div className={styles.clientInfo}>
                      <span className={styles.clientName}>{o.prenom} {o.nom}</span>
                      {o.whatsapp && o.whatsapp !== "N/A" && (
                        <a 
                          href={getWhatsappLink(o.whatsapp)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={styles.clientContact} 
                          style={{ color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Discuter sur WhatsApp"
                        >
                          {o.whatsapp}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className={styles.dateCell} data-label="Date">{new Date(o.createdAt || o.created_at).toLocaleDateString("fr-FR")}</td>
                  <td data-label="Articles">{o.lignes?.reduce((acc, l) => acc + l.quantite, 0) || 0}</td>
                  <td className={styles.fw500} data-label="Total">{formatPrice(o.total)}</td>
                  <td data-label="Statut">{getStatusDisplay(o.statut)}</td>
                  <td className={styles.rightAlign} data-label="Actions">
                    <div className={styles.actions}>
                      {(o.statut === "en_attente_paiement" || o.statut === "paiement_signale") && (
                        <>
                          <button onClick={() => handleAction(o.id, 'valider')} className={styles.btnAction} title="Valider le paiement">
                            <CheckCircle size={16} />
                          </button>
                          <button onClick={() => handleAction(o.id, 'annuler')} className={`${styles.btnAction} ${styles.btnDanger}`} title="Annuler">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      {o.statut === "payee" && (
                        <button onClick={() => handleAction(o.id, 'livrer')} className={styles.btnAction} title="Mettre en livraison">
                          <Truck size={16} />
                        </button>
                      )}
                      {o.statut === "en_livraison" && (
                        <button onClick={() => handleAction(o.id, 'livree')} className={styles.btnAction} title="Marquer comme livrée">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button className={styles.btnIcon} title="Détails" onClick={() => setSelectedOrder(o)}>
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(250, 248, 244, 0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setSelectedOrder(null)}>
          <div style={{
            background: 'var(--color-white)',
            border: '1px solid var(--color-line)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            padding: '32px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--color-ink)', margin: 0 }}>
                Détails de la commande {selectedOrder.numero}
              </h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <XCircle size={20} color="var(--color-grey)" />
              </button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-grey)', marginBottom: '8px' }}>Client</h4>
              <p style={{ margin: 0, fontSize: '14px' }}>{selectedOrder.prenom} {selectedOrder.nom}</p>
              {selectedOrder.whatsapp && selectedOrder.whatsapp !== "N/A" && (
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  WhatsApp: <a href={getWhatsappLink(selectedOrder.whatsapp)} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 500 }}>
                    {selectedOrder.whatsapp}
                  </a>
                </p>
              )}
              <p style={{ margin: 0, fontSize: '14px' }}>Quartier: {selectedOrder.quartier}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-grey)', marginBottom: '8px' }}>Articles</h4>
              {selectedOrder.lignes?.map((l, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      {l.quantite}x{" "}
                      <Link 
                        to={l.type === 'kit' ? `/admin/kits/${l.kit_id || l.produit_id}` : `/admin/produits/${l.produit_id}`} 
                        style={{ color: 'var(--color-ink)', textDecoration: 'underline' }}
                      >
                        {l.nom_produit}
                      </Link>
                      {l.type === 'kit' && <span style={{ fontSize: '10px', backgroundColor: 'var(--color-line)', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px', textTransform: 'uppercase', verticalAlign: 'middle' }}>KIT</span>}
                    </span>
                    <span style={{ fontWeight: 500 }}>{formatPrice(l.prix_unitaire * l.quantite)}</span>
                  </div>
                  {l.type === 'kit' && l.composition && (
                    <div style={{ paddingLeft: '16px', marginTop: '4px', fontSize: '12px', color: 'var(--color-grey)' }}>
                      <em>Contenu figé à l'achat :</em>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                        {l.composition.map((c, idx) => (
                          <li key={idx}>{c.quantite}x {c.nom_produit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '2px solid var(--color-ink)' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatPrice(selectedOrder.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

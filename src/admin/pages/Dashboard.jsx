import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAdminStats, fetchAdminStatistiques } from "@/lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, ShoppingBag, Clock, TrendingUp, AlertCircle, Download, Calendar } from 'lucide-react';
import Skeleton, { SkeletonRow } from '@/components/ui/Skeleton';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from "./Dashboard.module.css";
import s from "../admin.module.css";

const ICONS = {
  "Produits": Package,
  "Commandes": ShoppingBag,
  "En attente": Clock,
  "Revenu": TrendingUp
};

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recent, setRecent] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  // States pour la nouvelle API statistiques par période
  const [debut, setDebut] = useState('');
  const [fin, setFin] = useState('');
  const [statsPeriode, setStatsPeriode] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    fetchAdminStats().then(data => {
      setStats(data.stats || []);
      setRecent(data.recent || []);
      setLowStock(data.lowStock || []);
    }).catch(err => console.error("Erreur stats", err))
      .finally(() => setLoading(false));
  }, []);

  const loadStatsPeriode = () => {
    setLoadingStats(true);
    fetchAdminStatistiques(debut || undefined, fin || undefined)
      .then(data => {
        setStatsPeriode(data);
        if (!debut) setDebut(data.periode.debut);
        if (!fin) setFin(data.periode.fin);
      })
      .catch(err => console.error("Erreur stats période", err))
      .finally(() => setLoadingStats(false));
  };

  useEffect(() => {
    loadStatsPeriode();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ marginBottom: "2rem" }}>
          <Skeleton variant="title" width="200px" />
          <Skeleton variant="text" width="300px" />
        </div>
        <div className={styles.kpiGrid}>
          <Skeleton variant="card" height="120px" />
          <Skeleton variant="card" height="120px" />
          <Skeleton variant="card" height="120px" />
          <Skeleton variant="card" height="120px" />
        </div>
        <div style={{ marginTop: "2rem" }}>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  const handleExportPDF = async () => {
    try {
      const dashboardElement = document.getElementById("dashboard-content");
      if (!dashboardElement) return;

      const canvas = await html2canvas(dashboardElement, {
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: '#FAF8F4' // var(--color-cream)
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const dateStr = new Date().toISOString().split('T')[0];
      pdf.save(`myra_dashboard_${dateStr}.pdf`);
    } catch (err) {
      console.error("Erreur export PDF", err);
      alert("Erreur lors de l'exportation PDF.");
    }
  };

  // Formater les données de l'API Stats Période
  let salesData = [];
  let topProducts = [];
  let topKits = [];
  
  if (statsPeriode) {
    salesData = (statsPeriode.evolution || []).map(s => {
      const d = new Date(s.date);
      const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      return { name: `${days[d.getDay()]} ${d.getDate()}`, ventes: s.ca };
    });
    topProducts = statsPeriode.top_produits || [];
    topKits = statsPeriode.top_kits || [];
  }

  return (
    <div className={styles.container} id="dashboard-content">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Tableau de bord</h1>
          <p className={styles.subtitle}>Vue d'ensemble de l'activité Myra Skin Care</p>
        </div>
        <button 
          onClick={handleExportPDF}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            padding: '8px 16px', background: 'var(--color-ink)', 
            color: 'var(--color-white)', border: 'none', borderRadius: '4px',
            fontFamily: 'var(--font-sans)', fontSize: '12px', textTransform: 'uppercase', 
            letterSpacing: '0.05em', cursor: 'pointer'
          }}
          data-html2canvas-ignore="true"
        >
          <Download size={14} /> Exporter (PDF)
        </button>
      </header>

      {/* KPI Cards (Générales - Toujours identiques ou basées sur stats globales) */}
      <div className={styles.kpiGrid}>
        {stats.map((st) => {
          const Icon = ICONS[st.label] || AlertCircle;
          return (
            <div key={st.label} className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span className={styles.kpiLabel}>{st.label}</span>
                <Icon size={18} className={styles.kpiIcon} />
              </div>
              <div className={styles.kpiValue}>{st.value}</div>
              <div className={styles.kpiHint}>{st.hint}</div>
            </div>
          );
        })}
      </div>

      {/* Filtres de période pour les statistiques détaillées */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(250, 248, 244, 0.4)', border: '1px solid var(--color-line)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }} data-html2canvas-ignore="true">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-ink)', fontWeight: 'bold' }}>
          <Calendar size={18} /> Statistiques par période :
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '12px', textTransform: 'uppercase' }}>Du</label>
          <input 
            type="date" 
            value={debut} 
            onChange={(e) => setDebut(e.target.value)}
            style={{ padding: '8px', border: '1px solid var(--color-line)', borderRadius: '4px', fontFamily: 'var(--font-body)' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '12px', textTransform: 'uppercase' }}>Au</label>
          <input 
            type="date" 
            value={fin} 
            onChange={(e) => setFin(e.target.value)}
            style={{ padding: '8px', border: '1px solid var(--color-line)', borderRadius: '4px', fontFamily: 'var(--font-body)' }}
          />
        </div>
        <button 
          onClick={loadStatsPeriode}
          disabled={loadingStats}
          style={{ 
            padding: '8px 24px', background: 'var(--color-ink)', color: 'white', 
            border: 'none', borderRadius: '4px', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em'
          }}
        >
          {loadingStats ? "Chargement..." : "Filtrer"}
        </button>
      </div>

      {/* KPIs Spécifiques à la période */}
      {statsPeriode && (
        <div className={styles.kpiGrid} style={{ marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className={styles.kpiCard} style={{ background: '#fff' }}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiLabel}>Chiffre d'Affaires</span>
            </div>
            <div className={styles.kpiValue}>{statsPeriode.chiffre_affaires.toLocaleString('fr-FR')}</div>
            <div className={styles.kpiHint}>
              En ligne: {statsPeriode.ca_en_ligne?.toLocaleString('fr-FR') || 0} FCFA<br/>
              Boutique: {statsPeriode.ca_boutique?.toLocaleString('fr-FR') || 0} FCFA
            </div>
          </div>
          <div className={styles.kpiCard} style={{ background: '#fff' }}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiLabel}>Commandes Validées</span>
            </div>
            <div className={styles.kpiValue}>{statsPeriode.repartition_statuts.payee + statsPeriode.repartition_statuts.en_livraison + statsPeriode.repartition_statuts.livree}</div>
            <div className={styles.kpiHint}>sur la période</div>
          </div>
          <div className={styles.kpiCard} style={{ background: '#fff' }}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiLabel}>Panier Moyen</span>
            </div>
            <div className={styles.kpiValue}>{statsPeriode.panier_moyen.toLocaleString('fr-FR')}</div>
            <div className={styles.kpiHint}>FCFA sur la période</div>
          </div>
        </div>
      )}

      <div className={styles.mainGrid}>
        {/* Graphique d'évolution de la période sélectionnée */}
        <div className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
          <h2 className={styles.cardTitle}>Évolution du CA sur la période</h2>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-ink)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--color-ink)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-line)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-grey)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-grey)' }} />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toLocaleString('fr-FR')} FCFA`, 'Chiffre d\'Affaires']}
                  contentStyle={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-cream)', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                  itemStyle={{ color: 'var(--color-cream)' }}
                />
                <Area type="monotone" dataKey="ventes" stroke="var(--color-ink)" fillOpacity={1} fill="url(#colorVentes)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Produits Période */}
        <div className={styles.recentCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Top Produits (Période)</h2>
          </div>
          <div className={styles.listWrapper} style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topProducts.length === 0 ? <p className={styles.empty}>Aucune donnée sur cette période.</p> : topProducts.map((p, i) => (
              <Link to={`/admin/produits/${p.id}`} key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-ink)' }}>{i+1}. {p.nom}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 'bold', color: 'var(--color-ink)' }}>{p.quantite_vendue} vendus</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Kits Période */}
        <div className={styles.recentCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Top Kits (Période)</h2>
          </div>
          <div className={styles.listWrapper} style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topKits.length === 0 ? <p className={styles.empty}>Aucune donnée sur cette période.</p> : topKits.map((k, i) => (
              <Link to={`/admin/kits/${k.id}`} key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-ink)' }}>{i+1}. {k.nom}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 'bold', color: 'var(--color-ink)' }}>{k.quantite_vendue} vendus</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.recentCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Alerte Stocks ({lowStock.length})</h2>
          </div>
          <div className={styles.listWrapper} style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {lowStock.length === 0 ? <p className={styles.empty}>Aucun produit en rupture.</p> : lowStock.map(p => (
              <Link to={`/admin/produits/${p.id}`} key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-ink)' }}>{p.nom}</span>
                <span style={{ 
                  fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 'bold',
                  color: p.stock === 0 ? 'var(--color-red)' : 'var(--color-gold)',
                  background: p.stock === 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                  padding: '4px 8px', borderRadius: '4px'
                }}>
                  {p.stock === 0 ? 'Rupture' : `Reste: ${p.stock}`}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Commandes Récentes */}
        <div className={styles.recentCard} style={{ gridColumn: '1 / -1' }}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Commandes récentes</h2>
            <Link to="/admin/commandes" className={styles.cardLink}>Voir tout</Link>
          </div>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr><td colSpan="4" className={styles.empty}>Aucune commande récente.</td></tr>
                ) : recent.map((o) => (
                  <tr key={o.id}>
                    <td className={styles.fw500} data-label="N° Commande">{o.id}</td>
                    <td data-label="Client">{o.client}</td>
                    <td data-label="Montant">{o.total}</td>
                    <td data-label="Statut">
                      <span className={`${s.badge} ${
                        o.statut.includes("payée") ? s.badgeGold : 
                        o.statut.includes("livrée") ? s.badgeGreen : 
                        o.statut.includes("annulée") ? s.badgeRed : ""
                      }`}>
                        {o.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

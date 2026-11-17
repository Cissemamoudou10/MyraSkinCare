import { useState, useEffect } from "react";
import { fetchParametres, modifierParametres } from "@/lib/api";
import { useDialog } from "@/context/DialogContext";
import styles from "./Orders.module.css";
import s from "../admin.module.css";
import p from "./Settings.module.css";

const OPTIONS_NOUVEAUTE = [
  { jours: 30, label: "1 mois" },
  { jours: 60, label: "2 mois" },
  { jours: 90, label: "3 mois" },
];

export default function Settings() {
  const [form, setForm] = useState({ nouveaute_duree_jours: 60, orange_money_numero: "", sarali_numero: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useDialog();

  useEffect(() => {
    fetchParametres()
      .then((param) =>
        setForm({
          nouveaute_duree_jours: param.nouveaute_duree_jours,
          orange_money_numero: param.orange_money_numero || "",
          sarali_numero: param.sarali_numero || "",
        })
      )
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const modifier = (champ) => (e) => setForm({ ...form, [champ]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await modifierParametres(form);
      addToast("Paramètres enregistrés.", "success");
    } catch (err) {
      addToast(err?.response?.data?.message || "Erreur lors de l'enregistrement.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Paramètres</h1>
        <p className={styles.subtitle}>Réglages généraux de la boutique.</p>
      </header>

      <div className={`${styles.card} ${p.carte}`}>
        {loading ? (
          <div className={styles.loading}>Chargement...</div>
        ) : (
          <form onSubmit={handleSave} className={p.formulaire}>
            <section className={p.section}>
              <h2 className={p.titre}>Paiement</h2>
              <p className={p.texte}>
                Numéros envoyés aux clientes sur WhatsApp après leur commande. Laissez un champ
                vide pour ne pas proposer ce moyen de paiement.
              </p>
              <div className={s.field}>
                <label className={s.label} htmlFor="orange-money">Numéro Orange Money</label>
                <input id="orange-money" className={s.input} type="tel" inputMode="tel"
                  value={form.orange_money_numero} onChange={modifier("orange_money_numero")} />
              </div>
              <div className={s.field}>
                <label className={s.label} htmlFor="sarali">Numéro Sarali</label>
                <input id="sarali" className={s.input} type="tel" inputMode="tel"
                  value={form.sarali_numero} onChange={modifier("sarali_numero")} />
              </div>
            </section>

            <section className={p.section}>
              <h2 className={p.titre}>Rubrique « Nouveautés »</h2>
              <p className={p.texte}>
                Durée pendant laquelle un produit reste affiché dans « Nouveautés » sur le
                site, à compter de sa date de création.
              </p>
              <div className={s.field}>
                <label className={s.label} htmlFor="nouveaute">Seuil</label>
                <select id="nouveaute" className={s.select} value={form.nouveaute_duree_jours}
                  onChange={(e) => setForm({ ...form, nouveaute_duree_jours: parseInt(e.target.value, 10) })}>
                  {OPTIONS_NOUVEAUTE.map((o) => (
                    <option key={o.jours} value={o.jours}>{o.label}</option>
                  ))}
                </select>
              </div>
            </section>

            <button type="submit" className={s.btn} disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import SectionHead from "@/components/ui/SectionHead";
import { fetchAvis, soumettreAvis } from "@/lib/api";
import styles from "./Avis.module.css";

const NOTES = [
  { value: 5, label: "5 — Excellent" },
  { value: 4, label: "4 — Très bien" },
  { value: 3, label: "3 — Bien" },
  { value: 2, label: "2 — Moyen" },
  { value: 1, label: "1 — Décevant" },
];
const VIDE = { nom_client: "", email: "", note: 5, commentaire: "" };

export default function Avis() {
  const [avis, setAvis] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [form, setForm] = useState(VIDE);
  const [envoi, setEnvoi] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    fetchAvis()
      .then((res) => setAvis(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setChargement(false));
  }, []);

  const champ = (cle) => (e) => setForm({ ...form, [cle]: e.target.value });

  const envoyer = async (e) => {
    e.preventDefault();
    setEnvoi(true);
    setErreur("");
    try {
      await soumettreAvis(form);
      setEnvoye(true);
      setForm(VIDE);
    } catch (err) {
      setErreur(err?.response?.data?.message || "L'envoi a échoué. Veuillez réessayer.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="container-narrow">
        <SectionHead
          eyebrow="Témoignages"
          title="Avis clients"
          sub="Découvrez ce que nos clientes pensent de nos soins, et partagez votre expérience."
        />

        <div className={styles.colonnes}>
          <section className={styles.formulaireBloc}>
            <h2 className={styles.sousTitre}>Laissez votre avis</h2>
            {envoye ? (
              <p className={styles.merci}>
                Merci pour votre avis ! Il sera publié après validation.
              </p>
            ) : (
              <form onSubmit={envoyer} className={styles.formulaire}>
                <div className={styles.ligne}>
                  <label className={styles.champ}>
                    <span className={styles.etiquette}>Nom</span>
                    <input required value={form.nom_client} onChange={champ("nom_client")} />
                  </label>
                  <label className={styles.champ}>
                    <span className={styles.etiquette}>E-mail (non publié)</span>
                    <input required type="email" value={form.email} onChange={champ("email")} />
                  </label>
                </div>
                <div className={styles.champ}>
                  <span className={styles.etiquette}>Note</span>
                  <Select ariaLabel="Note" value={form.note} onChange={(v) => setForm({ ...form, note: v })} options={NOTES} />
                </div>
                <label className={styles.champ}>
                  <span className={styles.etiquette}>Votre avis</span>
                  <textarea required rows={5} value={form.commentaire} onChange={champ("commentaire")} />
                </label>
                {erreur && <p className={styles.erreur}>{erreur}</p>}
                <button type="submit" className={styles.envoyer} disabled={envoi}>
                  {envoi ? "Envoi…" : "Envoyer mon avis"}
                </button>
              </form>
            )}
          </section>

          <section>
            <h2 className={styles.sousTitre}>Avis récents</h2>
            {chargement ? (
              <p className={styles.texte}>Chargement…</p>
            ) : avis.length === 0 ? (
              <p className={styles.texte}>Aucun avis publié pour le moment. Soyez la première !</p>
            ) : (
              <ul className={styles.liste}>
                {avis.map((a) => (
                  <li key={a.id} className={styles.avis}>
                    <p className={styles.etoiles} aria-label={`${a.note} sur 5`}>
                      {"★".repeat(a.note)}{"☆".repeat(5 - a.note)}
                    </p>
                    <p className={styles.citation}>« {a.commentaire} »</p>
                    <p className={styles.auteur}>{a.nom_client}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

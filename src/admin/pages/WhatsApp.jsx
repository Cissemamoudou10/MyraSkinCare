import { useState, useEffect, useCallback } from "react";
import { fetchEtatWhatsapp, connecterWhatsapp, deconnecterWhatsapp, envoyerTestWhatsapp } from "@/lib/api";
import { useDialog } from "@/context/DialogContext";
import styles from "./Orders.module.css";
import s from "../admin.module.css";
import w from "./WhatsApp.module.css";

// Pendant l'appairage : vérification de l'état toutes les 3 s,
// QR code renouvelé toutes les 30 s (WhatsApp le fait expirer).
const VERIFICATION_MS = 3000;
const RENOUVELLEMENT_QR_MS = 30000;

const messageErreur = (err) =>
  err?.response?.data?.message || "Impossible de joindre le serveur. Réessayez.";

const BADGES = {
  connecte: { label: "Connecté", classe: styles.badgeGreen },
  connexion: { label: "En attente", classe: styles.badgeGold },
  deconnecte: { label: "Déconnecté", classe: styles.badgeWait },
};

export default function WhatsApp() {
  const { confirm, addToast } = useDialog();
  const [statut, setStatut] = useState(null); // { etat, numero, nom }
  const [appairage, setAppairage] = useState(null); // { qr, codeAppairage }
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [modeCode, setModeCode] = useState(false);
  const [numeroAppairage, setNumeroAppairage] = useState("");
  const [numeroTest, setNumeroTest] = useState("");

  const rafraichir = useCallback(async () => {
    try {
      const etat = await fetchEtatWhatsapp();
      setStatut(etat);
      setErreur("");
      return etat;
    } catch (err) {
      setErreur(messageErreur(err));
      return null;
    }
  }, []);

  // Applique la réponse de /connexion : soit déjà connecté, soit un QR/code à afficher
  const appliquerConnexion = useCallback((resultat) => {
    if (resultat.etat === "connecte") {
      setStatut(resultat);
      setAppairage(null);
    } else {
      setAppairage(resultat);
    }
  }, []);

  useEffect(() => {
    rafraichir();
  }, [rafraichir]);

  // Surveillance pendant l'appairage (setTimeout en chaîne : jamais deux appels en parallèle)
  useEffect(() => {
    if (!appairage) return undefined;
    let actif = true;
    let minuteur;
    const debut = Date.now();

    const verifier = async () => {
      const etat = await rafraichir();
      if (!actif) return;
      if (etat?.etat === "connecte") {
        setAppairage(null);
        addToast("WhatsApp est connecté.", "success");
        return;
      }
      if (!appairage.codeAppairage && Date.now() - debut >= RENOUVELLEMENT_QR_MS) {
        try {
          appliquerConnexion(await connecterWhatsapp());
        } catch (err) {
          setErreur(messageErreur(err));
          setAppairage(null);
        }
        return; // le nouvel appairage relance cet effet
      }
      minuteur = setTimeout(verifier, VERIFICATION_MS);
    };

    minuteur = setTimeout(verifier, VERIFICATION_MS);
    return () => {
      actif = false;
      clearTimeout(minuteur);
    };
  }, [appairage, rafraichir, appliquerConnexion, addToast]);

  const action = async (fn) => {
    setEnCours(true);
    setErreur("");
    try {
      await fn();
    } catch (err) {
      setErreur(messageErreur(err));
    } finally {
      setEnCours(false);
    }
  };

  const lancerConnexion = (e) => {
    e?.preventDefault();
    action(async () => appliquerConnexion(await connecterWhatsapp(modeCode ? numeroAppairage : undefined)));
  };

  const annulerConnexion = () =>
    action(async () => {
      setAppairage(null);
      setStatut(await deconnecterWhatsapp());
    });

  const deconnecter = async () => {
    const ok = await confirm(
      "Les clientes ne recevront plus les messages de commande tant qu'un numéro ne sera pas reconnecté.",
      "Déconnecter WhatsApp ?"
    );
    if (ok) action(async () => setStatut(await deconnecterWhatsapp()));
  };

  const envoyerTest = (e) => {
    e.preventDefault();
    action(async () => {
      await envoyerTestWhatsapp(numeroTest);
      addToast("Message de test envoyé.", "success");
    });
  };

  const etatAffiche = appairage ? "connexion" : statut?.etat === "connecte" ? "connecte" : "deconnecte";
  const badge = BADGES[etatAffiche];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>WhatsApp</h1>
        <p className={styles.subtitle}>Numéro de la boutique qui envoie les messages de commande aux clientes.</p>
      </header>

      <div className={`${styles.card} ${w.carte}`}>
        {!statut && !erreur ? (
          <div className={styles.loading}>Chargement...</div>
        ) : (
          <>
            <div className={w.entete}>
              <span className={`${styles.badge} ${badge.classe}`}>{badge.label}</span>
              {etatAffiche === "connecte" && statut.numero && (
                <span className={w.compte}>
                  +{statut.numero}
                  {statut.nom && <span className={w.nom}> · {statut.nom}</span>}
                </span>
              )}
            </div>

            {erreur && <p className={w.erreur}>{erreur}</p>}

            {etatAffiche === "connecte" && (
              <>
                <form onSubmit={envoyerTest} className={w.section}>
                  <label className={s.label} htmlFor="numero-test">Envoyer un message de test</label>
                  <div className={w.ligne}>
                    <input
                      id="numero-test"
                      className={s.input}
                      type="tel"
                      inputMode="tel"
                      placeholder="Ex. 70 00 00 00"
                      value={numeroTest}
                      onChange={(e) => setNumeroTest(e.target.value)}
                      required
                    />
                    <button type="submit" className={s.btn} disabled={enCours}>Envoyer</button>
                  </div>
                </form>
                <div className={w.section}>
                  <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSmall}`} onClick={deconnecter} disabled={enCours}>
                    Déconnecter
                  </button>
                </div>
              </>
            )}

            {etatAffiche === "connexion" && (
              <div className={w.section}>
                {appairage.codeAppairage && modeCode ? (
                  <>
                    <p className={w.code}>{appairage.codeAppairage}</p>
                    <ol className={w.etapes}>
                      <li>Ouvrez WhatsApp sur le téléphone de la boutique.</li>
                      <li>Appareils connectés → Connecter un appareil.</li>
                      <li>Choisissez « Connecter avec un numéro de téléphone » et saisissez ce code.</li>
                    </ol>
                  </>
                ) : (
                  <>
                    <img className={w.qr} src={appairage.qr} alt="QR code de connexion WhatsApp" />
                    <ol className={w.etapes}>
                      <li>Ouvrez WhatsApp sur le téléphone de la boutique.</li>
                      <li>Appareils connectés → Connecter un appareil.</li>
                      <li>Scannez ce QR code. Il se renouvelle automatiquement.</li>
                    </ol>
                  </>
                )}
                <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSmall}`} onClick={annulerConnexion} disabled={enCours}>
                  Annuler
                </button>
              </div>
            )}

            {etatAffiche === "deconnecte" && (
              <form onSubmit={lancerConnexion} className={w.section}>
                <p className={w.texte}>
                  Aucun numéro connecté : les messages de commande ne partent pas.
                </p>
                {modeCode && (
                  <div className={s.field}>
                    <label className={s.label} htmlFor="numero-appairage">Numéro WhatsApp de la boutique</label>
                    <input
                      id="numero-appairage"
                      className={s.input}
                      type="tel"
                      inputMode="tel"
                      placeholder="Ex. 70 00 00 00"
                      value={numeroAppairage}
                      onChange={(e) => setNumeroAppairage(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className={w.ligne}>
                  <button type="submit" className={s.btn} disabled={enCours}>
                    {enCours ? "Patientez…" : modeCode ? "Obtenir un code" : "Connecter un numéro"}
                  </button>
                  <button type="button" className={w.lien} onClick={() => setModeCode(!modeCode)}>
                    {modeCode ? "Utiliser un QR code" : "Je suis sur le téléphone à connecter"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

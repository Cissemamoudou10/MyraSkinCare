import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import styles from "./Footer.module.css";

const INFOS = [
  { label: "Conditions Générales de Vente", to: "/cgv" },
  { label: "Mentions Légales", to: "/mentions-legales" },
  { label: "Expéditions et Livraisons", to: "/expeditions" },
  { label: "Politique de Retour", to: "/retours" },
  { label: "Politique de Confidentialité", to: "/confidentialite" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        {/* À propos */}
        <div>
          <div className={styles.brand}>
            <span className={styles.brandName}>Myra</span>
            <span className={styles.brandSub}>Skin Care</span>
          </div>
          <p className={styles.eyebrow}>À propos</p>
          <p className={styles.about}>
            Myra Skin Care, c'est votre destination beauté dédiée aux soins coréens
            authentiques. Notre mission : vous offrir des produits efficaces,
            sélectionnés avec soin pour révéler l'éclat naturel de votre peau.
          </p>
          <p className={styles.city}>Bamako, Mali</p>
          <a href="mailto:skincaremyra97@gmail.com" className={styles.email}>
            skincaremyra97@gmail.com
          </a>
          <div className={styles.socials}>
            <a href="https://instagram.com/myraskincare" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://tiktok.com/@myraskincare" target="_blank" rel="noreferrer">TikTok</a>
            <a href="https://wa.me/223777777" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>

        {/* Infos */}
        <div>
          <p className={styles.colTitle}>Infos</p>
          {INFOS.map((x) => (
            <Link key={x.label} to={x.to} className={styles.link}>{x.label}</Link>
          ))}
        </div>

        {/* Newsletter */}
        <div>
          <p className={styles.colTitle}>Newsletter</p>
          <p className={styles.nlText}>
            Inscrivez-vous pour recevoir nos conseils skincare, découvrir nos
            nouveautés coréennes et profiter d'offres exclusives.
          </p>
          <div className={styles.nlField}>
            <input placeholder="Votre adresse e-mail" />
          </div>
          <Button variant="solid">S'inscrire</Button>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© 2026 Myra Skin Care — Tous droits réservés</span>
        <span>La beauté coréenne au service de votre éclat naturel.</span>
      </div>
    </footer>
  );
}

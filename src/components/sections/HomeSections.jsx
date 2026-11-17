import { useEffect, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import Button from "@/components/ui/Button";
import { ProductCard, MiniCard } from "@/components/ui/ProductCard";
import { KitCard } from "@/components/ui/KitCard";
import { fetchProduits, fetchProblemes, fetchMarques, fetchAvis, fetchPublicArticles, fetchKits } from "@/lib/api";
import { urlImage } from "@/lib/images";
import { Link } from "react-router-dom";
import styles from "./HomeSections.module.css";

const TYPE_LABELS = { conseil: "Conseils", ingredient: "Ingrédients", rituel: "Rituels" };

/* Réassurance */
export function Reassurance() {
  const items = [
    { t: "Livraison à Bamako", d: "Sous 24 à 48 h, et partout au Mali." },
    { t: "Conseil personnalisé", d: "Échangez avec nous sur WhatsApp." },
    { t: "Paiement mobile", d: "Orange Money ou Sarali, avant l'expédition." },
  ];
  return (
    <section className={styles.reassurance}>
      <div className={`container-narrow ${styles.reassuranceGrid}`}>
        {items.map((it) => (
          <div key={it.t} className={styles.reassuranceItem}>
            <p className={styles.star}>✦</p>
            <p className={styles.reassuranceTitle}>{it.t}</p>
            <p className={styles.reassuranceDesc}>{it.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* Par préoccupation */
export function Concerns() {
  const [concerns, setConcerns] = useState([]);
  useEffect(() => {
    fetchProblemes().then(res => setConcerns(res.data?.slice(0, 4) || []));
  }, []);

  return (
    <section className={styles.padCream}>
      <Reveal>
        <SectionHead
          eyebrow="Par où commencer"
          title="Quel est votre besoin ?"
          sub="Trouvez les soins adaptés à votre peau, selon ce qui compte pour vous."
        />
      </Reveal>
      <div className={`container-narrow ${styles.concernsGrid}`}>
        {concerns.map((c, i) => (
          <Reveal key={c.nom} delay={(i % 4) * 0.08}>
            <Link to={`/boutique?probleme=${c.slug}`} className={styles.concern}>
              <div className={styles.concernImg}>
                {c.image_url && <img src={urlImage(c.image_url)} alt="" />}
              </div>
              <div className={styles.concernLabel}>
                <span>{c.nom}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* Collection */
export function Collection({ onOpen }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetchProduits({ limit: 8, tag: "k-beauty", sort: "nom", order: "asc" }).then(res => setProducts(res.data || []));
  }, []);

  return (
    <section className={styles.padCream}>
      <Reveal>
        <SectionHead eyebrow="La collection" title="Soins du quotidien" />
      </Reveal>
      <div className={`container ${styles.productGrid}`}>
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.1}>
            <ProductCard p={p} onOpen={onOpen} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* Nouveautés */
export function NewArrivals() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetchProduits({ limit: 4, sort: 'date', order: 'desc', nouveautes: 'true' }).then(res => setProducts(res.data || []));
  }, []);

  return (
    <section className={styles.padWhite}>
      <Reveal>
        <SectionHead eyebrow="Tout juste arrivés" title="Les nouveautés" />
      </Reveal>
      <div className={`container-narrow ${styles.miniGrid}`}>
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 0.08}>
            <MiniCard p={p} badge="Nouveau" />
          </Reveal>
        ))}
      </div>
      <div className={styles.center}>
        <Button variant="dark" to="/boutique?filtre=nouveautes">Voir toutes les nouveautés</Button>
      </div>
    </section>
  );
}

/* Nos kits (routines composées) */
export function Kits() {
  const [kits, setKits] = useState([]);
  useEffect(() => {
    fetchKits({ limit: 3 }).then((res) => setKits(res.data || [])).catch(() => setKits([]));
  }, []);

  if (kits.length === 0) return null;
  return (
    <section className={styles.padCream}>
      <Reveal>
        <SectionHead
          eyebrow="Nos routines"
          title="Les kits Myra"
          sub="Des routines complètes, composées pour vous, à adopter en une fois."
        />
      </Reveal>
      <div className={`container ${styles.productGrid}`}>
        {kits.map((kit, i) => (
          <Reveal key={kit.id} delay={(i % 3) * 0.1}>
            <KitCard kit={kit} />
          </Reveal>
        ))}
      </div>
      <div className={styles.center}>
        <Button variant="dark" to="/nos-kits">Voir tous les kits</Button>
      </div>
    </section>
  );
}

/* Éditorial / philosophie */
export function Editorial() {
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    fetchProduits({ limit: 4, tag: "serum" })
      .then((res) => setPhotos((res.data || []).map((p) => p.photo).filter(Boolean)))
      .catch(() => setPhotos([]));
  }, []);

  return (
    <section className={styles.editorial}>
      <div className={styles.editorialText}>
        <Reveal>
          <p className={styles.editorialEyebrow}>Notre philosophie</p>
          <h2 className={styles.editorialTitle}>
            L'expertise coréenne,<br />
            <em>au service de votre peau</em>
          </h2>
          <p className={styles.editorialP}>
            Myra Skin Care est une boutique spécialisée dans les soins coréens
            (K-Beauty) : nettoyants, sérums, crèmes hydratantes, masques, protections
            solaires et traitements ciblés, formulés avec des ingrédients innovants.
          </p>
          <p className={styles.editorialP}>
            Notre mission : aider chacun à révéler une peau saine, éclatante et
            naturellement belle, grâce à des soins adaptés à tous les types de peau.
          </p>
        </Reveal>
      </div>
      <div className={styles.editorialMosaic}>
        {photos.map((photo) => (
          <div key={photo} className={styles.editorialTile}>
            <img src={urlImage(photo)} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* Marques partenaires */
export function PartnerBrands() {
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    fetchMarques().then(res => setBrands(res.data || []));
  }, []);

  return (
    <section className={styles.padWhiteTop}>
      <Reveal>
        <SectionHead
          eyebrow="Notre sélection"
          title="Les marques partenaires"
          sub="Une sélection exigeante de marques coréennes, et quelques incontournables du soin du corps."
        />
      </Reveal>
      <div className={`${styles.brandsGrid}`}>
        {brands.map((b) => (
          <Link key={b.id} to={`/boutique?marque=${b.slug}`} className={styles.brand}>
            <span>{b.nom}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* Avis clients */
export function Reviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    fetchAvis().then(res => setReviews(res.data || []));
  }, []);

  if (reviews.length === 0) return null;
  return (
    <section className={styles.reviews}>
      <Reveal>
        <SectionHead eyebrow="Témoignages" title="Ce qu'elles en disent" light />
      </Reveal>
      <div className={`container-narrow ${styles.reviewsGrid}`}>
        {reviews.map((r, i) => (
          <Reveal key={r.id} delay={(i % 3) * 0.1}>
            <div className={styles.review}>
              <p className={styles.stars}>{"★".repeat(r.note)}{"☆".repeat(5 - r.note)}</p>
              <p className={styles.reviewText}>« {r.commentaire} »</p>
              <p className={styles.reviewAuthor}>
                {r.nom_client}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* À propos */
export function About() {
  return (
    <section className={styles.padWhite}>
      <Reveal>
        <div className={styles.about}>
          <p className={styles.aboutEyebrow}>À propos</p>
          <h2 className={styles.aboutTitle}>
            Votre destination beauté,<br />
            <em>dédiée aux soins coréens</em>
          </h2>
          <p className={styles.aboutText}>
            Myra Skin Care, c'est votre destination beauté dédiée aux soins coréens
            authentiques. Notre mission est de vous offrir des produits efficaces,
            sélectionnés avec soin pour révéler l'éclat naturel de votre peau et vous
            accompagner vers une routine adaptée à vos besoins.
          </p>
          <div className={styles.aboutMeta}>
            <span>Bamako, Mali</span>
            <span className={styles.metaStar}>✦</span>
            <a href="mailto:skincaremyra97@gmail.com">skincaremyra97@gmail.com</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* Journal */
export function Journal() {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    fetchPublicArticles({ limit: 3 }).then(res => setArticles(res.data || []));
  }, []);

  if (articles.length === 0) return null;
  return (
    <section className={styles.padCream}>
      <Reveal>
        <SectionHead
          eyebrow="Le journal"
          title="Conseils &amp; rituels"
          sub="Nos gestes, nos ingrédients, nos inspirations pour prendre soin de soi."
        />
      </Reveal>
      <div className={`container-narrow ${styles.journalGrid}`}>
        {articles.map((a, i) => (
          <Reveal key={a.id} delay={(i % 3) * 0.1}>
            <Link to="/journal" className={styles.article}>
              <div className={styles.articleImg}>
                {a.image_url && <img src={urlImage(a.image_url)} alt="" />}
              </div>
              <p className={styles.articleCat}>{TYPE_LABELS[a.type] || a.type}</p>
              <h3 className={styles.articleTitle}>{a.titre}</h3>
              <span className={styles.articleLink}>Lire l'article</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

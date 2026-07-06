import { useEffect, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import Button from "@/components/ui/Button";
import { ProductCard, MiniCard } from "@/components/ui/ProductCard";
import { fetchProduits, fetchProblemes, fetchMarques, fetchAvis } from "@/lib/api";
import { Link } from "react-router-dom";
import {
  ARTICLES,
} from "@/data/products";
import styles from "./HomeSections.module.css";

const img = (id, w = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75`;

/* Réassurance */
export function Reassurance() {
  const items = [
    { t: "Livraison à Bamako", d: "Sous 24 à 48 h, et partout au Mali." },
    { t: "Conseil personnalisé", d: "Échangez avec nous sur WhatsApp." },
    { t: "Paiement à la livraison", d: "Réglez en toute confiance, à réception." },
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
            <Link to={`/preoccupations?id=${c.id}`} className={styles.concern}>
              <div className={styles.concernImg}>
                <img src={img("1556228720-195a672e8a03", 500)} alt="" />
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
    fetchProduits({ limit: 6 }).then(res => setProducts(res.data || []));
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
    fetchProduits({ limit: 4, sort: 'date', order: 'desc' }).then(res => setProducts(res.data || []));
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

/* Best-sellers */
export function BestSellers() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    // Note: sans endpoint 'bestsellers' spécifique, on trie par nom ou on limite
    fetchProduits({ limit: 4, sort: 'nom', order: 'asc' }).then(res => setProducts(res.data || []));
  }, []);

  return (
    <section className={styles.padCream}>
      <Reveal>
        <SectionHead
          eyebrow="Les préférés"
          title="Best-sellers"
          sub="Les soins plébiscités par notre clientèle."
        />
      </Reveal>
      <div className={`container-narrow ${styles.miniGrid}`}>
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 0.08}>
            <MiniCard p={p} badge="Best-seller" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* Éditorial / philosophie */
export function Editorial() {
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
      <div
        className={styles.editorialImg}
        style={{ backgroundImage: `url(${img("1556228578-8c89e6adf883", 1100)})` }}
      />
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
          sub="Aux côtés de nos propres soins, une sélection exigeante de marques que nous aimons."
        />
      </Reveal>
      <div className={`${styles.brandsGrid}`}>
        {brands.map((b) => (
          <div key={b.id} className={styles.brand}>
            <span>{b.nom}</span>
          </div>
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

  return (
    <section className={styles.reviews}>
      <Reveal>
        <SectionHead eyebrow="Témoignages" title="Ce qu'elles en disent" light />
      </Reveal>
      <div className={`container-narrow ${styles.reviewsGrid}`}>
        {reviews.length === 0 ? (
          <p style={{ color: "#fff", textAlign: "center", gridColumn: "1 / -1" }}>Aucun avis pour le moment.</p>
        ) : reviews.map((r, i) => (
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
        {ARTICLES.map((a, i) => (
          <Reveal key={a.title} delay={(i % 3) * 0.1}>
            <Link to="/journal" className={styles.article}>
              <div className={styles.articleImg}>
                <img src={img(a.img)} alt="" />
              </div>
              <p className={styles.articleCat}>{a.cat}</p>
              <h3 className={styles.articleTitle}>{a.title}</h3>
              <span className={styles.articleLink}>Lire l'article</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

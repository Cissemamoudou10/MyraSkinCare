import styles from "./SectionHead.module.css";

export default function SectionHead({ eyebrow, title, sub, light }) {
  return (
    <div className={`${styles.head} ${light ? styles.light : ""}`}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  );
}

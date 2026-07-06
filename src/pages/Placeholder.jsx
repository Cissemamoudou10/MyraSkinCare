import styles from "./Placeholder.module.css";

export default function Placeholder({ title, subtitle }) {
  return (
    <div className={styles.page}>
      <div className="container-narrow">
        <p className={styles.eyebrow}>Myra Skin Care</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>
          {subtitle ||
            "Cette page sera développée prochainement, dans le même esprit que le reste du site."}
        </p>
      </div>
    </div>
  );
}

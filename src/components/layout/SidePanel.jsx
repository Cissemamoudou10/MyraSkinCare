import { useState } from "react";
import { Link } from "react-router-dom";
import { NAV } from "@/data/navigation";
import { CloseIcon } from "@/components/ui/icons";
import styles from "./SidePanel.module.css";

export default function SidePanel({ open, onClose }) {
  const [openIdx, setOpenIdx] = useState(-1);

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={onClose}
      />
      <aside className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>
        <button onClick={onClose} className={styles.close}>
          <CloseIcon size={16} /> <span>Fermer</span>
        </button>

        <nav className={styles.nav}>
          {NAV.map((item, i) => {
            const isOpen = openIdx === i;
            const hasSub = !!item.sub;
            return (
              <div key={item.label} className={styles.item}>
                {hasSub ? (
                  <button
                    className={styles.itemBtn}
                    onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  >
                    {item.label}
                    <span className={`${styles.plus} ${isOpen ? styles.plusOpen : ""}`}>
                      +
                    </span>
                  </button>
                ) : (
                  <Link to={item.to || "#"} className={styles.itemBtn} onClick={onClose}>
                    {item.label}
                  </Link>
                )}

                {hasSub && (
                  <div
                    className={styles.sub}
                    style={{ maxHeight: isOpen ? item.sub.length * 46 + 8 : 0 }}
                  >
                    {item.sub.map((s, idx) => (
                      <Link key={s.label || idx} to={s.to || "#"} className={styles.sublink} onClick={onClose}>
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

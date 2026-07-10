import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { creerCommande } from "@/lib/api";
import { CloseIcon } from "@/components/ui/icons";
import Button from "@/components/ui/Button";
import { useDialog } from "@/context/DialogContext";
import styles from "./CartDrawer.module.css";

const getImgSrc = (photo) => {
  if (!photo) return "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=50&q=75";
  return photo.startsWith("http") ? photo : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4000'}${photo}`;
};

export default function CartDrawer() {
  const navigate = useNavigate();
  const { isCartOpen, setIsCartOpen, cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState(false);
  const [form, setForm] = useState({ prenom: "", nom: "", whatsapp: "", quartier: "" });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const { addToast } = useDialog();

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setCheckoutStep(false);
      setSuccessMsg("");
    }, 300);
  };
  const handleContinueShopping = () => {
    handleClose();
    setTimeout(() => {
      navigate("/boutique");
    }, 300);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        prenom: form.prenom,
        nom: form.nom,
        whatsapp: form.whatsapp,
        quartier: form.quartier,
        articles: cartItems.map(item => {
          if (item.isKit) {
            return { kit_id: item.kit_id, quantite: item.quantite };
          }
          return { produit_id: item.produit_id, quantite: item.quantite };
        })
      };
      const res = await creerCommande(payload);
      setSuccessMsg(`Commande #${res.numero} créée avec succès ! Vous serez contacté sur WhatsApp.`);
      clearCart();
    } catch (err) {
      addToast(err?.response?.data?.message || "Erreur lors de la validation de la commande.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`${styles.overlay} ${isCartOpen ? styles.overlayOpen : ""}`} onClick={handleClose} />
      <aside className={`${styles.panel} ${isCartOpen ? styles.panelOpen : ""}`}>
        <div className={styles.header}>
          <h2>Mon Panier</h2>
          <button onClick={handleClose} className={styles.close}>
            <CloseIcon size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {successMsg ? (
            <div className={styles.success}>
              <h3>Merci !</h3>
              <p>{successMsg}</p>
              <button onClick={handleClose} className={styles.btn}>Fermer</button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className={styles.empty}>
              <p>Votre panier est vide.</p>
              <button onClick={handleContinueShopping} className={styles.btn}>Continuer mes achats</button>
            </div>
          ) : !checkoutStep ? (
            <div className={styles.cartList}>
              {cartItems.map((item) => {
                const uid = item.uniqueId || `prod-${item.produit_id}`;
                return (
                <div key={uid} className={styles.cartItem}>
                  <img src={getImgSrc(item.photo)} alt={item.nom} className={styles.itemImg} />
                  <div className={styles.itemInfo}>
                    <h4 className={styles.itemName}>{item.nom} {item.isKit && <span style={{fontSize:'10px', color:'#d32f2f', marginLeft:'4px'}}>(Kit)</span>}</h4>
                    <p className={styles.itemPrice}>{formatPrice(item.prix)}</p>
                    <div className={styles.quantityControls}>
                      <button onClick={() => updateQuantity(uid, item.quantite - 1)}>-</button>
                      <span>{item.quantite}</span>
                      <button 
                        onClick={() => updateQuantity(uid, item.stock ? Math.min(item.stock, item.quantite + 1) : item.quantite + 1)}
                        disabled={item.stock !== undefined && item.quantite >= item.stock}
                      >+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(uid)} className={styles.removeBtn}>
                    <CloseIcon size={16} />
                  </button>
                </div>
              )})}
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Total</span>
                  <span className={styles.totalPrice}>{formatPrice(cartTotal)}</span>
                </div>
                <button onClick={() => setCheckoutStep(true)} className={styles.btn}>Commander</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCheckout} className={styles.checkoutForm}>
              <h3>Informations de livraison</h3>
              <div className={styles.field}>
                <label>Prénom</label>
                <input required value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} />
              </div>
              <div className={styles.field}>
                <label>Nom</label>
                <input required value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} />
              </div>
              <div className={styles.field}>
                <label>Numéro WhatsApp</label>
                <input required type="tel" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} placeholder="Ex: 70 12 34 56" />
                <span style={{ fontSize: '10px', color: 'var(--color-grey)', marginTop: '-8px' }}>Saisissez votre numéro à 8 chiffres (l'indicatif +223 est géré automatiquement).</span>
              </div>
              <div className={styles.field}>
                <label>Quartier (Bamako)</label>
                <input required value={form.quartier} onChange={e => setForm({...form, quartier: e.target.value})} />
              </div>
              
              <div className={styles.actions}>
                <button type="button" onClick={() => setCheckoutStep(false)} className={styles.btnGhost}>Retour</button>
                <Button type="submit" variant="solid" isLoading={loading}>
                  Valider la commande
                </Button>
              </div>
            </form>
          )}
        </div>
      </aside>
    </>
  );
}

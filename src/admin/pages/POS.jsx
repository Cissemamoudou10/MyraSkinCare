import { useState, useEffect, useMemo } from "react";
import { fetchAdminProduits, fetchAdminKits, creerVentePOS } from "@/lib/api";
import { ShoppingBag, Search, Plus, Minus, Trash2, CheckCircle, Package } from "lucide-react";
import Button from "@/components/ui/Button";
import { useDialog } from "@/context/DialogContext";
import styles from "./POS.module.css";
import s from "../admin.module.css";

export default function POS() {
  const [produits, setProduits] = useState([]);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { addToast } = useDialog();

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const [pRes, kRes] = await Promise.all([
          fetchAdminProduits(),
          fetchAdminKits()
        ]);
        setProduits(pRes.data || []);
        setKits(kRes.data || []);
      } catch (err) {
        addToast("Erreur lors du chargement des stocks.", "error");
      } finally {
        setLoading(false);
      }
    };
    loadInventory();
  }, []);

  // Items combinés pour la grille
  const items = useMemo(() => {
    const prods = produits.map(p => ({ ...p, type: "produit", displayName: p.nom, displayPrice: p.prix }));
    const kts = kits.map(k => {
      // Calculer le prix final du kit
      const prixPlein = (k.produits || []).reduce((acc, p) => acc + (p.prix * (p.KitProduit?.quantite || 1)), 0);
      let prixFinal = prixPlein;
      if (k.promo_active && k.reduction_pourcentage > 0) {
        prixFinal = Math.round(prixPlein * (1 - k.reduction_pourcentage / 100));
      }
      // Calculer le stock disponible du kit (min des stocks des produits divisé par quantité requise)
      let stockDispo = Infinity;
      if (!k.produits || k.produits.length === 0) stockDispo = 0;
      else {
        k.produits.forEach(p => {
          const qteRequise = p.KitProduit?.quantite || 1;
          const maxKits = Math.floor(p.stock / qteRequise);
          if (maxKits < stockDispo) stockDispo = maxKits;
        });
      }

      return { ...k, type: "kit", displayName: k.nom, displayPrice: prixFinal, stock: stockDispo };
    });

    const combined = [...prods, ...kts].filter(i => i.actif !== false);

    if (!search.trim()) return combined;
    const lower = search.toLowerCase();
    return combined.filter(i => i.displayName.toLowerCase().includes(lower));
  }, [produits, kits, search]);

  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.type === item.type);
      if (existing) {
        if (existing.quantite + 1 > item.stock) {
          addToast("Stock insuffisant.", "error");
          return prev;
        }
        return prev.map(i => i.id === item.id && i.type === item.type ? { ...i, quantite: i.quantite + 1 } : i);
      } else {
        if (item.stock < 1) {
          addToast("Rupture de stock.", "error");
          return prev;
        }
        return [...prev, { 
          id: item.id, 
          type: item.type, 
          nom: item.displayName, 
          prix_unitaire: item.displayPrice,
          quantite: 1,
          maxStock: item.stock
        }];
      }
    });
  };

  const updateQuantity = (id, type, delta) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.id === id && i.type === type) {
          const newQty = i.quantite + delta;
          if (newQty > i.maxStock) {
            addToast("Stock insuffisant.", "error");
            return i;
          }
          if (newQty < 1) return i; // use delete to remove
          return { ...i, quantite: newQty };
        }
        return i;
      });
    });
  };

  const removeFromCart = (id, type) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.type === type)));
  };

  const totalCart = cart.reduce((acc, i) => acc + (i.prix_unitaire * i.quantite), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const payload = {
        total: totalCart,
        items: cart.map(i => ({
          type: i.type,
          id: i.id,
          quantite: i.quantite,
          prix_unitaire: i.prix_unitaire
        }))
      };
      await creerVentePOS(payload);
      setSuccess(true);
      setCart([]);
      
      // Rafraîchir l'inventaire pour avoir les nouveaux stocks
      const [pRes, kRes] = await Promise.all([
        fetchAdminProduits(),
        fetchAdminKits()
      ]);
      setProduits(pRes.data || []);
      setKits(kRes.data || []);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      addToast(err?.response?.data?.message || "Erreur lors de l'encaissement", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={s.container}>Chargement...</div>;

  return (
    <div className={styles.posContainer}>
      {/* Partie Inventaire (Gauche) */}
      <div className={styles.inventorySection}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Caisse (POS)</h1>
            <p className={styles.subtitle}>Enregistrez une vente en boutique.</p>
          </div>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Chercher un produit ou kit..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.itemsGrid}>
          {items.map(item => (
            <div 
              key={`${item.type}-${item.id}`} 
              className={`${styles.itemCard} ${item.stock === 0 ? styles.outOfStock : ''}`}
              onClick={() => { if (item.stock > 0) handleAddToCart(item); }}
            >
              {item.type === "kit" && <span className={styles.badgeKit}>KIT</span>}
              <div className={styles.itemImageWrapper}>
                {item.photo ? (
                  <img src={item.photo.startsWith("http") ? item.photo : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4000'}${item.photo}`} alt={item.displayName} className={styles.itemImage} />
                ) : (
                  <div className={styles.placeholderImage}><Package size={24} color="#ccc" /></div>
                )}
              </div>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.displayName}</h3>
                <div className={styles.itemPriceStock}>
                  <span className={styles.itemPrice}>{item.displayPrice.toLocaleString("fr-FR")} FCFA</span>
                  <span className={styles.itemStock}>
                    {item.stock > 0 ? `${item.stock} dispo` : "Rupture"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: 'var(--color-grey)' }}>
              Aucun article trouvé.
            </div>
          )}
        </div>
      </div>

      {/* Partie Panier (Droite) */}
      <div className={styles.cartSection}>
        <h2 className={styles.cartTitle}>Ticket de Caisse</h2>
        
        {success ? (
          <div className={styles.successState}>
            <CheckCircle size={48} color="var(--color-green)" />
            <p>Paiement validé avec succès !</p>
          </div>
        ) : (
          <>
            <div className={styles.cartItems}>
              {cart.length === 0 ? (
                <div className={styles.emptyCart}>
                  <ShoppingBag size={32} />
                  <p>Le panier est vide</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={`${item.type}-${item.id}`} className={styles.cartItemRow}>
                    <div className={styles.cartItemDetails}>
                      <span className={styles.cartItemName}>{item.nom}</span>
                      <span className={styles.cartItemPrice}>{(item.prix_unitaire * item.quantite).toLocaleString("fr-FR")} FCFA</span>
                    </div>
                    <div className={styles.cartItemActions}>
                      <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.type, -1)}><Minus size={14} /></button>
                      <span className={styles.qtyValue}>{item.quantite}</span>
                      <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.type, 1)}><Plus size={14} /></button>
                      <button className={styles.delBtn} onClick={() => removeFromCart(item.id, item.type)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className={styles.cartFooter}>
              <div className={styles.cartTotal}>
                <span>Total à encaisser</span>
                <span className={styles.totalValue}>{totalCart.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <Button 
                variant="solid" 
                style={{ width: '100%', padding: '16px' }} 
                disabled={cart.length === 0 || submitting}
                isLoading={submitting}
                onClick={handleCheckout}
              >
                Valider l'encaissement
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

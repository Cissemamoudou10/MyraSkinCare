import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("myra_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("myra_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemData, qty = 1, isKit = false) => {
    setCartItems((prev) => {
      const uniqueId = `${isKit ? 'kit' : 'prod'}-${itemData.id}`;
      // Compatibilité ancien panier
      const existing = prev.find((item) => (item.uniqueId || `prod-${item.produit_id}`) === uniqueId);
      
      if (existing) {
        return prev.map((item) =>
          (item.uniqueId || `prod-${item.produit_id}`) === uniqueId
            ? { ...item, quantite: item.quantite + qty }
            : item
        );
      }
      
      const prix = isKit ? itemData.prix.prix_final : itemData.prix;
      
      return [...prev, { 
        uniqueId,
        produit_id: isKit ? null : itemData.id, 
        kit_id: isKit ? itemData.id : null,
        nom: itemData.nom, 
        prix: prix, 
        photo: itemData.photo,
        quantite: qty,
        isKit 
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (uniqueId) => {
    setCartItems((prev) => prev.filter((item) => (item.uniqueId || `prod-${item.produit_id}`) !== uniqueId));
  };

  const updateQuantity = (uniqueId, quantite) => {
    if (quantite < 1) {
      removeFromCart(uniqueId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        (item.uniqueId || `prod-${item.produit_id}`) === uniqueId ? { ...item, quantite } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.prix * item.quantite, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantite, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

import { createContext, useContext, useState } from "react";
import ProductModal from "@/components/ui/ProductModal";

const ProductModalContext = createContext();

export function ProductModalProvider({ children }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <ProductModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={closeModal} 
        />
      )}
    </ProductModalContext.Provider>
  );
}

export const useProductModal = () => useContext(ProductModalContext);

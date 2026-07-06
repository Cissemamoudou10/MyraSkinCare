import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const DialogContext = createContext();

export function DialogProvider({ children }) {
  const [confirmState, setConfirmState] = useState(null);
  const [toasts, setToasts] = useState([]);

  // ---- CONFIRM MODAL ----
  const confirm = useCallback((message, title = "Confirmation") => {
    return new Promise((resolve) => {
      setConfirmState({
        message,
        title,
        onConfirm: () => {
          setConfirmState(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(null);
          resolve(false);
        }
      });
    });
  }, []);

  // ---- TOASTS ----
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const getToastIcon = (type) => {
    if (type === "success") return <CheckCircle size={16} color="var(--color-ink)" />;
    if (type === "error") return <XCircle size={16} color="var(--color-red)" />;
    if (type === "warning") return <AlertTriangle size={16} color="var(--color-gold)" />;
    return <Info size={16} color="var(--color-ink)" />;
  };

  return (
    <DialogContext.Provider value={{ confirm, addToast }}>
      {children}
      
      {/* Rendu des Toasts */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: 'var(--color-white)',
            border: '1px solid var(--color-line)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            padding: '12px 16px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--color-ink)',
            minWidth: '250px',
            animation: 'slideIn 0.3s ease-out forwards'
          }}>
            {getToastIcon(t.type)}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Rendu de la Modale de Confirmation */}
      {confirmState && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(250, 248, 244, 0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--color-white)',
            border: '1px solid var(--color-line)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            padding: '32px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            animation: 'popIn 0.2s ease-out forwards'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '20px',
              color: 'var(--color-ink)',
              margin: '0 0 16px 0'
            }}>{confirmState.title}</h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--color-grey)',
              lineHeight: '1.5',
              margin: '0 0 24px 0'
            }}>{confirmState.message}</p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={confirmState.onCancel}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-line)',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink)',
                  cursor: 'pointer'
                }}>
                Annuler
              </button>
              <button 
                onClick={confirmState.onConfirm}
                style={{
                  background: 'var(--color-ink)',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-cream)',
                  cursor: 'pointer'
                }}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ajout des animations via une balise style injectée */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes popIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </DialogContext.Provider>
  );
}

export const useDialog = () => useContext(DialogContext);

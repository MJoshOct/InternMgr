import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ msg: "", type: "", visible: false });

  const showToast = useCallback((msg, type = "") => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={`toast ${toast.visible ? "show" : ""} ${toast.type}`}>
        {toast.msg}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

import { createContext, useContext, useState, useEffect } from "react";
import { loginAdmin } from "@/lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("myra_admin_token"));
  const [user, setUser] = useState(null); // Optionnel, pour stocker les infos de l'admin
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si on avait une route /admin/me, on la vérifierait ici
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await loginAdmin(credentials);
    if (data.token) {
      localStorage.setItem("myra_admin_token", data.token);
      setToken(data.token);
      setUser(data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem("myra_admin_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import s from "../admin.module.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ username, password });
      navigate("/admin");
    } catch (err) {
      setError("Identifiants incorrects ou erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "var(--color-cream)" }}>
      <div style={{ background: "white", padding: "3rem", borderRadius: "8px", width: "100%", maxWidth: "400px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <h1 className={s.pageTitle} style={{ textAlign: "center", marginBottom: "2rem" }}>Myra Admin</h1>
        {error && <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.field}>
            <label className={s.label}>Nom d'utilisateur</label>
            <input className={s.input} value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className={s.field}>
            <label className={s.label}>Mot de passe</label>
            <input className={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" variant="solid" isLoading={loading} style={{ width: "100%", marginTop: "1rem" }}>
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
}

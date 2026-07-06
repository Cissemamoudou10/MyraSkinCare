import axios from "axios";

// Configuration de l'instance Axios
const api = axios.create({
  // URL du backend lue depuis .env
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  // Permet d'envoyer les cookies/credentials si nécessaire
  withCredentials: true,
});

// Intercepteur pour ajouter le token JWT sur les routes d'administration
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("myra_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour détecter les 401 (token expiré ou invalide)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Déconnecter l'utilisateur si c'est une route admin protégée (qui n'est pas /login)
      if (error.config.url && !error.config.url.includes("/login")) {
        localStorage.removeItem("myra_admin_token");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// --- API Publique ---

export const fetchProduits = async (params = {}) => {
  const { data } = await api.get("/produits", { params });
  return data; // { produits: [...], total, pages }
};

export const fetchProduitParSlug = async (slug) => {
  const { data } = await api.get(`/produits/${slug}`);
  return data;
};

export const fetchKits = async (params = {}) => {
  const { data } = await api.get("/kits", { params });
  return data;
};

export const fetchKitParSlug = async (slug) => {
  const { data } = await api.get(`/kits/${slug}`);
  return data;
};

export const creerCommande = async (commandeData) => {
  const { data } = await api.post("/commandes", commandeData);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const fetchMarques = async () => {
  const { data } = await api.get("/marques");
  return data;
};

export const fetchProblemes = async () => api.get("/problemes").then((r) => r.data);
export const fetchTypesPeau = async () => api.get("/types-peau").then((r) => r.data);
export const fetchTags = async () => api.get("/tags").then((r) => r.data);

export const fetchActifs = async () => {
  const { data } = await api.get("/principes-actifs");
  return data;
};

export const fetchAvis = async () => {
  const { data } = await api.get("/avis");
  return data;
};

export const soumettreAvis = async (avisData) => {
  const { data } = await api.post("/avis", avisData);
  return data;
};

export const fetchRecherche = async (q) => {
  const { data } = await api.get("/recherche", { params: { q } });
  return data;
};

// --- API Admin ---

export const loginAdmin = async (credentials) => {
  const { data } = await api.post("/admin/login", credentials);
  return data; // { token, admin }
};

export const fetchAdminProduits = async () => {
  const { data } = await api.get("/admin/produits");
  return data;
};

export const fetchAdminStats = async () => {
  const { data } = await api.get("/admin/dashboard/stats");
  return data;
};

export const fetchAdminStatistiques = async (debut, fin) => {
  const params = {};
  if (debut) params.debut = debut;
  if (fin) params.fin = fin;
  const { data } = await api.get("/admin/statistiques", { params });
  return data;
};

export const fetchAdminMarques = async () => {
  const { data } = await api.get("/admin/marques");
  return data;
};

export const fetchAdminCategories = async () => {
  const { data } = await api.get("/admin/categories");
  return data;
};

export const fetchAdminProblemes = async () => {
  const { data } = await api.get("/admin/problemes");
  return data;
};

export const fetchAdminActifs = async () => {
  const { data } = await api.get("/admin/principes-actifs");
  return data;
};

export const fetchAdminTypesPeau = async () => {
  const { data } = await api.get("/admin/types-peau");
  return data;
};

export const fetchAdminTags = async () => {
  const { data } = await api.get("/admin/tags");
  return data;
};
export const creerProduit = async (formData) => {
  // On utilise formData car il y a potentiellement un upload d'image
  const { data } = await api.post("/admin/produits", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const modifierProduit = async (id, formData) => {
  const { data } = await api.put(`/admin/produits/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const fetchAdminKits = async () => {
  const { data } = await api.get("/admin/kits");
  return data;
};

export const creerKit = async (formData) => {
  const { data } = await api.post("/admin/kits", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const modifierKit = async (id, formData) => {
  const { data } = await api.put(`/admin/kits/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const supprimerKit = async (id) => {
  const { data } = await api.delete(`/admin/kits/${id}`);
  return data;
};

export const creerMarque = async (marqueData) => {
  const { data } = await api.post("/admin/marques", marqueData);
  return data;
};

export const modifierMarque = async (id, marqueData) => {
  const { data } = await api.put(`/admin/marques/${id}`, marqueData);
  return data;
};

export const supprimerMarque = async (id) => {
  const { data } = await api.delete(`/admin/marques/${id}`);
  return data;
};

// --- Référentiels génériques ---
export const creerReferentiel = async (chemin, payload) => {
  const { data } = await api.post(`/admin/${chemin}`, payload);
  return data;
};

export const modifierReferentiel = async (chemin, id, payload) => {
  const { data } = await api.put(`/admin/${chemin}/${id}`, payload);
  return data;
};

export const supprimerReferentiel = async (chemin, id) => {
  const { data } = await api.delete(`/admin/${chemin}/${id}`);
  return data;
};

export const fetchAdminAvis = async () => {
  const { data } = await api.get("/admin/avis");
  return data;
};

export const publierAvisAdmin = async (id) => {
  const { data } = await api.patch(`/admin/avis/${id}/publier`);
  return data;
};

export const rejeterAvisAdmin = async (id) => {
  return api.patch(`/admin/avis/${id}/rejeter`).then((r) => r.data);
};

// POS (Ventes directes en boutique)
export const creerVentePOS = (data) => api.post("/admin/pos/vente", data).then((r) => r.data);

export const fetchCommandes = async () => {
  const { data } = await api.get("/admin/commandes");
  return data;
};

export const modifierStatutCommande = async (id, action) => {
  // action = valider, signaler, livraison, livree, annuler
  const { data } = await api.patch(`/admin/commandes/${id}/${action}`);
  return data;
};

export const validerCommandeAdmin = async (id) => modifierStatutCommande(id, "valider");
export const livrerCommande = async (id) => modifierStatutCommande(id, "livraison");
export const marquerLivreeCommande = async (id) => modifierStatutCommande(id, "livree");
export const annulerCommande = async (id) => modifierStatutCommande(id, "annuler");

// --- Articles (Journal) ---
export const fetchPublicArticles = async (params = {}) => {
  const { data } = await api.get("/articles", { params });
  return data;
};

export const fetchPublicArticleParSlug = async (slug) => {
  const { data } = await api.get(`/articles/${slug}`);
  return data;
};

export const fetchAdminArticles = async (params = {}) => {
  const { data } = await api.get("/admin/articles", { params });
  return data;
};

export const creerArticle = async (payload) => {
  const { data } = await api.post("/admin/articles", payload);
  return data;
};

export const modifierArticle = async (id, payload) => {
  const { data } = await api.put(`/admin/articles/${id}`, payload);
  return data;
};

export const supprimerArticle = async (id) => {
  const { data } = await api.delete(`/admin/articles/${id}`);
  return data;
};

export default api;

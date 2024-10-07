// src/context/AuthContext.js
import { createContext, useState, useContext } from "react";

// Création du contexte
const AuthContext = createContext();

// Fournisseur du contexte pour englober toute l'application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fonction de connexion
  const login = (userData) => {
    setUser(userData);
    // Ici tu peux ajouter une logique pour sauvegarder le token dans le localStorage
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    // Ici tu peux aussi retirer le token du localStorage si tu en utilises un
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook pour utiliser AuthContext plus facilement
export const useAuth = () => useContext(AuthContext);

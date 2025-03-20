import { createContext, useContext, useEffect, useState } from "react";
import { auth, listenForAuthChanges } from "./firebase"; // ✅ Ensure correct path

// 🔹 Create Authentication Context
const AuthContext = createContext();

// 🔹 Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use listenForAuthChanges instead of onAuthStateChanged
    const unsubscribe = listenForAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 🔹 Custom Hook to Use Auth
export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../lib/axios"; // Ensure this is imported

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Initialize state directly from localStorage to prevent the "Flash of Home Page"
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  // 2. Only stay in loading state if there is a token to verify
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/auth/me");
        
        // Update state with fresh data from the DB
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (error) {
        console.error("Session expired or invalid token on reload");
        // Only logout if the backend explicitly rejects the token
        logout(); 
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    // Empty dependency array ensures this only runs once when the app starts
  }, []);

  const login = (userData, userToken) => {
    console.log("Login function triggered!");
    console.log("Token received:", userToken ? "Yes" : "No");
    
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
      {/* 3. Render children even while loading if we have a token, or show nothing to prevent redirect */}
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
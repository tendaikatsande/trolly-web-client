import { createContext, useState, useEffect, useMemo } from "react";
import api from "../configs/api";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ email: "tendaikatsande@live.com" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const response = await api.post("/api/auth/refresh", {
        refresh_token: refreshToken,
      });
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);
      return access_token;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      logout();
      return null;
    }
  };

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/auth/profile");
      setUser(response.data);
      localStorage.setItem("user", response.data.id);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token might be expired, try to refresh it
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Retry the request with the new access token
          const retryResponse = await api.get("/api/auth/profile");
          setUser(retryResponse.data);
          localStorage.setItem("user", retryResponse.data.id);
        }
      } else {
        console.error("Error fetching user profile:", error);
        setUser();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = ({ email, password }) => {
    return api.post("/api/auth/login", { email, password });
  };

  const register = (payload) => {
    return api.post("/api/auth/register", payload);
  };

  const getUserRoles = () => {
    return user?.roles?.map((role) => role.name) || [];
  };

  const isAdmin = () => getUserRoles().includes("ROLE_ADMIN");
  const isClient = () => getUserRoles().includes("ROLE_CLIENT");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const setTokens = ({ token, refreshToken }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const authValue = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      getUser,
      setTokens,
      refreshAccessToken,
      isAdmin,
      isClient,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

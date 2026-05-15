"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api-config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Verify token is still valid by making an API call
          const res = await api.get("/users/me");
          setUser(res.data);
        }
      } catch (err) {
        console.log("Auth init failed:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // LOGIN
  const login = async (data) => {
    try {
      const res = await api.post("/users/login", data);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const error = new Error(
        err.response?.data?.message || err.message || "Login failed"
      );
      throw error;
    }
  };

  // REGISTER
  const register = async (data) => {
    try {
      const res = await api.post("/users", data);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const error = new Error(
        err.response?.data?.message || err.message || "Registration failed"
      );
      throw error;
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

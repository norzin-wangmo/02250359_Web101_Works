"use client";

import { createContext, useContext, useState } from "react";
import api from "@/lib/api-config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // LOGIN
  const login = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      console.log("Login success");
    } catch (err) {
      console.log("Login error", err);
    }
  };

  // REGISTER
  const register = async (data) => {
    try {
      const res = await api.post("/auth/register", data);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      console.log("Register success");
    } catch (err) {
      console.log("Register error", err);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook
export const useAuth = () => useContext(AuthContext);
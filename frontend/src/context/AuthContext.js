// src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  const getAccessToken = async () => {
    try {
      const response = await axios.get(
        "https://randusanga-kulonbackend-production.up.railway.app/token",
        { withCredentials: true }
      );
      setAccessToken(response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      console.error("Gagal memperbarui token:", error.response?.data.msg);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

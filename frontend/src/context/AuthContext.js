// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(0);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get(
          "https://randusanga-kulon.osc-fr1.scalingo.io/token",
          {
            withCredentials: true,
          }
        );
        setAccessToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };
    refreshToken();
  }, []);

  const getAccessToken = async () => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get(
        "https://randusanga-kulon.osc-fr1.scalingo.io/token",
        {
          withCredentials: true,
        }
      );
      setAccessToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
      return response.data.accessToken;
    }
    return accessToken;
  };

  return (
    <AuthContext.Provider value={{ accessToken, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

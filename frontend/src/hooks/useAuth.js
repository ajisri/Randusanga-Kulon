import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";

const useAuth = (navigate) => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");

  useEffect(() => {
    const refreshToken = async () => {
      try {
        console.log("Meminta token baru...");
        const response = await axios.get(
          "https://randusanga-kulonbackend-production.up.railway.app/token"
        );
        console.log("Token diterima:", response.data.accessToken);
        setToken(response.data.accessToken);

        const decoded = jwt_decode(response.data.accessToken);
        console.log("Token terdecode:", decoded);
        setExpire(decoded.exp);

        // Tambahkan debugger di sini
        debugger; // Hentikan eksekusi untuk pemeriksaan
      } catch (error) {
        console.error("Error refreshing token:", error);
        navigate("/");
      }
    };

    refreshToken();
  }, [navigate]);

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get(
          "https://randusanga-kulonbackend-production.up.railway.app/token"
        );
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosJWT;
};

export default useAuth;

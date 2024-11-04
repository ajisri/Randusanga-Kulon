import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";

const useAuth = (navigate) => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");

  useEffect(() => {
    const refreshToken = async () => {
      console.log("Memanggil refreshToken..."); // Debug log untuk memastikan fungsi dipanggil
      try {
        const response = await axios.get(
          "https://randusanga-kulonbackend-production.up.railway.app/token",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pastikan token sudah diatur sebelumnya
            },
          }
        );
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      } catch (error) {
        console.error("Error refreshing token:", error);
        navigate("/"); // Navigasi kembali jika terjadi kesalahan
      }
    };

    // Panggil refreshToken jika token belum ada atau telah kadaluarsa
    if (!token || expire * 1000 < new Date().getTime()) {
      refreshToken();
    }
  }, [token, expire, navigate]);

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        console.log("Token expired, memanggil refreshToken...");
        const response = await axios.get(
          "https://randusanga-kulonbackend-production.up.railway.app/token",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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

  return axiosJWT; // Mengembalikan instance axios dengan interceptor
};

export default useAuth;

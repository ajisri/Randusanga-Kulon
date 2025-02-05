import { useEffect } from "react";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";

// State global untuk mencegah race condition saat refresh token
let isRefreshing = false;
let refreshSubscribers = [];

// Fungsi untuk menambahkan subscriber yang menunggu token baru
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Fungsi untuk memberi tahu subscriber bahwa token telah diperbarui
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Fungsi untuk mengambil token baru dari backend
const refreshToken = async (navigate) => {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const response = await axios.get(
        "https://randusanga-kulon.osc-fr1.scalingo.io/token",
        { withCredentials: true }
      );
      const newToken = response.data.accessToken;
      onRefreshed(newToken);
      isRefreshing = false;
      return newToken;
    } catch (error) {
      isRefreshing = false;
      navigate("/"); // Logout jika refresh gagal
      throw error;
    }
  }

  // Jika refresh token sedang berjalan, request lain akan menunggu
  return new Promise((resolve) => {
    subscribeTokenRefresh(resolve);
  });
};

// Custom hook untuk autentikasi
const useAuth = (navigate) => {
  const axiosJWT = axios.create();

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get(
          "https://randusanga-kulon.osc-fr1.scalingo.io/token",
          { withCredentials: true }
        );
        const decoded = jwt_decode(response.data.accessToken);
        localStorage.setItem("expire", decoded.exp); // Simpan waktu expired
      } catch (error) {
        navigate("/"); // Redirect ke login jika gagal
      }
    };
    getToken();
  }, [navigate]);

  // Buffer waktu sebelum token kedaluwarsa (60 detik)
  const bufferTime = 60;

  axiosJWT.interceptors.request.use(
    async (config) => {
      const expire = localStorage.getItem("expire");
      const currentTime = Math.floor(Date.now() / 1000);

      // Jika token akan kedaluwarsa dalam waktu buffer, perbarui token
      if (expire - bufferTime < currentTime) {
        try {
          const newToken = await refreshToken(navigate);
          const decoded = jwt_decode(newToken);
          localStorage.setItem("expire", decoded.exp);
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          return Promise.reject(error);
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosJWT;
};

export default useAuth;

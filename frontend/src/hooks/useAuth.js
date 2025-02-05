import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";

const useAuth = (navigate) => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get(
          "https://randusanga-kulon.osc-fr1.scalingo.io/token",
          { withCredentials: true } // ⬅️ Pastikan refreshToken dikirim dari cookie
        );
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      } catch (error) {
        navigate("/");
      }
    };

    refreshToken();
  }, [navigate]);

  const axiosJWT = axios.create();

  // Interceptor untuk menangani permintaan dengan token
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        try {
          const response = await axios.get(
            "https://randusanga-kulon.osc-fr1.scalingo.io/token",
            { withCredentials: true } // ⬅️ Pastikan refreshToken dikirim dari cookie
          );
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setExpire(decoded.exp);

          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        } catch (error) {
          navigate("/"); // Redirect jika refresh token tidak valid
          return Promise.reject(error);
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // **Tambahkan interceptor response untuk menangani error 401**
  axiosJWT.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          const res = await axios.get(
            "https://randusanga-kulon.osc-fr1.scalingo.io/token",
            { withCredentials: true }
          );
          error.config.headers[
            "Authorization"
          ] = `Bearer ${res.data.accessToken}`;
          setToken(res.data.accessToken);
          setExpire(jwt_decode(res.data.accessToken).exp);

          // Coba request ulang dengan token baru
          return axiosJWT(error.config);
        } catch (err) {
          navigate("/"); // Redirect jika refresh token tidak valid
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosJWT;
};

export default useAuth;

import React, { useState } from "react";
import useSWR from "swr";
import { Image } from "primereact/image";
import styles from "../../assets/css/Galeri.module.css";

// Fungsi fetcher untuk mengambil data dari API
const fetcher = (url) => fetch(url).then((res) => res.json());

const Galeri = () => {
  const { data: galeriData, error: galeriError } = useSWR(
    "http://localhost:8080/galeripengunjung",
    fetcher
  );
  const [isPaused, setIsPaused] = useState(false);

  if (galeriError) {
    return <div>Error loading data</div>;
  }

  if (!galeriData) {
    return <div>Loading...</div>;
  }

  const galeriItems = galeriData.galeris || [];
  const tripledGaleriItems = [...galeriItems, ...galeriItems, ...galeriItems]; // Tiga kali duplikat untuk konten menyambung

  // Fungsi untuk menangani klik dan menghentikan animasi
  const handleClick = () => {
    setIsPaused((prevState) => !prevState); // Toggle perputaran
  };

  return (
    <div
      className={`${styles.galleryContainer} ${isPaused ? "paused" : ""}`}
      onClick={handleClick}
    >
      {/* Baris Atas (bergerak ke kanan) */}
      <div
        className={`${styles.galleryRow} ${styles.scrollRight} ${
          isPaused ? "paused" : ""
        }`}
      >
        <div className={styles.galleryWrapper}>
          {tripledGaleriItems.map((item, index) => (
            <div key={index} className={styles.galleryItem}>
              <Image
                src={`http://localhost:8080${item.file_url}`}
                alt={item.title}
                className={styles.galleryImage}
                preview
                width="100%"
                height="100%"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Baris Bawah (bergerak ke kiri) */}
      <div
        className={`${styles.galleryRow} ${styles.scrollLeft} ${
          isPaused ? "paused" : ""
        }`}
      >
        <div className={styles.galleryWrapper}>
          {tripledGaleriItems.map((item, index) => (
            <div key={index} className={styles.galleryItem}>
              <Image
                src={`http://localhost:8080${item.file_url}`}
                alt={item.title}
                className={styles.galleryImage}
                preview
                width="100%"
                height="100%"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Galeri;

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [isWaveVisible, setIsWaveVisible] = useState(false); // State untuk efek gelombang

  if (galeriError) {
    return <div>Error loading data</div>;
  }

  if (!galeriData) {
    return <div>Loading...</div>;
  }

  const galeriItems = galeriData.galeris || [];
  const repeatedItems = Array.from({ length: 3 }, () => galeriItems).flat();

  const handleImageClick = (item) => {
    setSelectedImage(item); // Simpan item yang diklik ke dalam state
    setIsWaveVisible(true); // Menampilkan gelombang ketika popup terbuka
  };

  // Fungsi untuk menutup popup
  const handleClosePopup = () => {
    setSelectedImage(null);
    setIsWaveVisible(false); // Menyembunyikan gelombang saat popup ditutup
  };

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
          {repeatedItems.map((item, index) => (
            <div
              key={index}
              className={styles.galleryItem}
              onClick={() => handleImageClick(item)}
            >
              <Image
                src={`http://localhost:8080${item.file_url}`}
                alt={item.title}
                className={styles.galleryImage}
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
          {repeatedItems.map((item, index) => (
            <div
              key={index}
              className={styles.galleryItem}
              onClick={() => handleImageClick(item)}
            >
              <Image
                src={`http://localhost:8080${item.file_url}`}
                alt={item.title}
                className={styles.galleryImage}
                width="100%"
                height="100%"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Efek Gelombang */}
      {isWaveVisible && <div className={styles.waveEffect}></div>}

      {selectedImage && (
        <div className={styles.popupOverlay} onClick={handleClosePopup}>
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={handleClosePopup}>
              ✖
            </button>
            <img
              src={`http://localhost:8080${selectedImage.file_url}`}
              alt={selectedImage.title}
              className={styles.popupImage}
            />
            <div className={styles.popupDetails}>
              <h3>{selectedImage.title}</h3>
              <p
                dangerouslySetInnerHTML={{ __html: selectedImage.content }}
              ></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Galeri;

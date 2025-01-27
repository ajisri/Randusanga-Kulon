import React, { useState } from "react";
import useSWR from "swr";
import { Image } from "primereact/image";
import styles from "../../assets/css/Pengumuman.module.css";

// Fungsi fetcher untuk mengambil data dari API
const fetcher = (url) => fetch(url).then((res) => res.json());

const Pengumuman = () => {
  const { data: pengumumanData, error: pengumumanError } = useSWR(
    "http://localhost:8080/pengumumanpengunjung",
    fetcher
  );
  const [isPaused, setIsPaused] = useState(false);

  if (pengumumanError) {
    return <div>Error loading data</div>;
  }

  if (!pengumumanData) {
    return <div>Loading...</div>;
  }

  const pengumumanItems = pengumumanData.pengumumans || [];
  const tripledNewsItems = [
    ...pengumumanItems,
    ...pengumumanItems,
    ...pengumumanItems,
  ]; // Tiga kali duplikat untuk konten menyambung

  const formatTanggal = (dateString) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Fungsi untuk menangani klik dan menghentikan animasi
  const handleClick = () => {
    setIsPaused((prevState) => !prevState); // Toggle perputaran
  };

  return (
    <div
      className={`${styles.newsContainer} ${isPaused ? "paused" : ""}`}
      onClick={handleClick}
    >
      <div
        className={`${styles.newsContentWrapper} ${isPaused ? "paused" : ""}`}
      >
        {tripledNewsItems.map((item, index) => (
          <div
            className={`${styles.newsItem} ${styles.slideIn}`}
            key={index}
            style={{
              marginRight: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              className={styles.imageContainer}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
              }}
            >
              <Image
                src={`http://localhost:8080${item.file_url}`}
                alt={item.title}
                className={styles.newsImage}
                preview
                width="100%"
                height="100%"
                style={{
                  objectFit: "contain",
                  backgroundColor: "#f0f0f0",
                }}
              />
            </div>
            <div className={styles.newsContent}>
              <h4 className={styles.newsTitle}>{item.title}</h4>
              <p
                dangerouslySetInnerHTML={{ __html: item.content }}
                className={styles.newsDescription}
              />
              <div className={styles.newsDetails}>
                <span className={styles.newsDate}>
                  {formatTanggal(item.created_at)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pengumuman;

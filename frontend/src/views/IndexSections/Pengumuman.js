import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { Image } from "primereact/image";
import styles from "../../assets/css/Pengumuman.module.css";

// Fungsi fetcher untuk mengambil data dari API
const fetcher = (url) => fetch(url).then((res) => res.json());

const Pengumuman = () => {
  const { data: pengumumanData, error: pengumumanError } = useSWR(
    "https://randusanga-kulon.osc-fr1.scalingo.io/pengumumanpengunjung",
    fetcher
  );
  const [isPaused, setIsPaused] = useState(false);
  const newsContentWrapperRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const scrollContent = () => {
      if (!isPaused && newsContentWrapperRef.current) {
        scrollPositionRef.current -= 1; // Kecepatan scroll
        if (
          scrollPositionRef.current <=
          -newsContentWrapperRef.current.scrollWidth / 3
        ) {
          scrollPositionRef.current = 0; // Reset posisi saat mencapai akhir
        }
        newsContentWrapperRef.current.style.transform = `translateX(${scrollPositionRef.current}px)`;
      }
      animationFrameRef.current = requestAnimationFrame(scrollContent);
    };

    animationFrameRef.current = requestAnimationFrame(scrollContent);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused]);

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
        ref={newsContentWrapperRef}
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
                src={`https://randusanga-kulon.osc-fr1.scalingo.io${item.file_url}`}
                alt={item.title}
                className={styles.newsImage}
                preview
                width="100%"
                height="100%"
                style={{
                  objectFit: "contain",
                  backgroundColor: "#ffffff",
                }}
              />
            </div>
            <div className={styles.newsContent}>
              <h4 className={styles.newsTitle}>{item.title}</h4>
              <p
                dangerouslySetInnerHTML={{ __html: item.content }}
                className={styles.newsDescription}
              />
              <div className={styles.newsFooter}>
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

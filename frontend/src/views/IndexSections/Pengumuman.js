import React, { useState, useEffect, useRef, useCallback } from "react"; // Tambahkan useCallback
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const newsContentWrapperRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollPositionRef = useRef(0);

  // Fungsi untuk menggerakkan konten secara otomatis
  const startAutoScroll = useCallback(() => {
    const scrollContent = () => {
      if (!isPaused && !isDragging && newsContentWrapperRef.current) {
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
  }, [isPaused, isDragging]); // Dependensi isPaused dan isDragging

  // Mulai animasi saat komponen dimount atau dependensi berubah
  useEffect(() => {
    startAutoScroll();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startAutoScroll]); // Gunakan startAutoScroll sebagai dependensi

  // Fungsi untuk menangani klik dan menghentikan/memulai animasi
  const handleClick = () => {
    setIsPaused((prevState) => !prevState);
  };

  // Fungsi untuk menangani mouse down (mulai drag)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - newsContentWrapperRef.current.offsetLeft);
    setScrollLeft(scrollPositionRef.current);
  };

  // Fungsi untuk menangani mouse move (saat drag)
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - newsContentWrapperRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Kecepatan drag
    scrollPositionRef.current = scrollLeft - walk;
    newsContentWrapperRef.current.style.transform = `translateX(${scrollPositionRef.current}px)`;
  };

  // Fungsi untuk menangani mouse up (berhenti drag)
  const handleMouseUp = () => {
    setIsDragging(false);
  };

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

  return (
    <div
      className={`${styles.newsContainer} ${isPaused ? "paused" : ""}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Berhenti drag saat mouse meninggalkan area
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

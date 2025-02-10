import React, { useState, useEffect, useRef, useCallback } from "react";
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

  const newsContentWrapperRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollSpeed = 1; // Kecepatan scroll

  // Gunakan useCallback untuk mencegah fungsi berubah di setiap render
  const startAutoScroll = useCallback(() => {
    const scrollContent = () => {
      if (newsContentWrapperRef.current && !isPaused) {
        newsContentWrapperRef.current.scrollLeft += scrollSpeed;

        // Jika sudah mencapai batas konten pertama, reset posisi untuk seamless scroll
        if (
          newsContentWrapperRef.current.scrollLeft >=
          newsContentWrapperRef.current.scrollWidth / 3
        ) {
          newsContentWrapperRef.current.scrollLeft = 0;
        }
      }

      animationFrameRef.current = requestAnimationFrame(scrollContent);
    };

    animationFrameRef.current = requestAnimationFrame(scrollContent);
  }, [isPaused]); // Tambahkan `isPaused` sebagai dependensi

  // Mulai infinite scroll saat komponen dimount
  useEffect(() => {
    startAutoScroll();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [startAutoScroll]); // Sekarang `startAutoScroll` aman untuk dimasukkan dalam dependensi

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
  ]; // Tiga kali duplikat untuk seamless scroll

  const formatTanggal = (dateString) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div
      className={styles.newsContainer}
      onMouseEnter={() => setIsPaused(true)} // Pause saat hover
      onMouseLeave={() => setIsPaused(false)} // Lanjutkan scroll saat mouse keluar
    >
      <div ref={newsContentWrapperRef} className={styles.newsContentWrapper}>
        {tripledNewsItems.map((item, index) => (
          <div className={styles.newsItem} key={index}>
            <div className={styles.imageContainer}>
              <Image
                src={`https://randusanga-kulon.osc-fr1.scalingo.io${item.file_url}`}
                alt={item.title}
                className={styles.newsImage}
                preview
                width="100%"
                height="100%"
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

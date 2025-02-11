import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { Image } from "primereact/image";
import styles from "../../assets/css/Pengumuman.module.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Pengumuman = () => {
  const { data: pengumumanData, error: pengumumanError } = useSWR(
    "https://randusanga-kulon.osc-fr1.scalingo.io/pengumumanpengunjung",
    fetcher
  );
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef(null);

  useEffect(() => {
    if (marqueeRef.current) {
      const wrapper = marqueeRef.current;
      let scrollAmount = 0;
      const speed = 0.5; // Kecepatan scroll

      const scrollNews = () => {
        if (!isPaused) {
          scrollAmount -= speed;
          wrapper.style.transform = `translateX(${scrollAmount}px)`;
          if (Math.abs(scrollAmount) > wrapper.scrollWidth / 2) {
            scrollAmount = 0; // Reset ke awal jika sudah mencapai setengah dari panjangnya
          }
        }
        requestAnimationFrame(scrollNews);
      };

      scrollNews();
    }
  }, [isPaused]);

  if (pengumumanError) {
    return <div>Error loading data</div>;
  }

  if (!pengumumanData) {
    return <div>Loading...</div>;
  }

  const pengumumanItems = pengumumanData.pengumumans || [];
  const tripledNewsItems = [...pengumumanItems, ...pengumumanItems];

  const formatTanggal = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      className={styles.newsContainer}
      onClick={() => setIsPaused(!isPaused)}
    >
      <div
        ref={marqueeRef}
        className={`${styles.newsContentWrapper} ${
          isPaused ? styles.paused : ""
        }`}
      >
        {tripledNewsItems.map((item, index) => (
          <div key={index} className={`${styles.newsItem} ${styles.fadeIn}`}>
            <div className={styles.imageContainer}>
              <Image
                src={`https://randusanga-kulon.osc-fr1.scalingo.io${item.file_url}`}
                alt={item.title}
                className={styles.newsImage}
                preview
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

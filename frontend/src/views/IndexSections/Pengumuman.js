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
  const containerRef = useRef(null);

  const pengumumanItems = pengumumanData?.pengumumans || [];
  const tripledNewsItems = [
    ...pengumumanItems,
    ...pengumumanItems,
    ...pengumumanItems,
  ];

  const formatTanggal = (dateString) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const handleClick = () => {
    setIsPaused((prev) => !prev);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let animationFrame;
    const speed = 1;

    const scrollContent = () => {
      if (!isPaused) {
        container.scrollLeft += speed;
        if (container.scrollLeft >= container.scrollWidth / 3) {
          container.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(scrollContent);
    };

    animationFrame = requestAnimationFrame(scrollContent);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused]);

  if (pengumumanError) {
    return <div>Error loading data</div>;
  }

  return (
    <div
      ref={containerRef}
      className={styles.newsContainer}
      onClick={handleClick}
      style={{
        overflowX: "hidden",
        whiteSpace: "nowrap",
        cursor: "pointer",
        display: "flex",
      }}
    >
      <div
        className={styles.newsContentWrapper}
        style={{ display: "flex", animation: "none" }}
      >
        {tripledNewsItems.map((item, index) => (
          <div
            className={styles.newsItem}
            key={index}
            style={{
              minWidth: "300px",
              marginRight: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className={styles.imageContainer} style={{ height: "300px" }}>
              <Image
                src={`https://randusanga-kulon.osc-fr1.scalingo.io${item.file_url}`}
                alt={item.title}
                className={styles.newsImage}
                preview
                width="100%"
                height="100%"
                style={{ objectFit: "contain", backgroundColor: "#ffffff" }}
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

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const newsContentWrapperRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollPositionRef = useRef(0);

  const startAutoScroll = useCallback(() => {
    const scrollContent = () => {
      if (!isPaused && !isDragging && newsContentWrapperRef.current) {
        scrollPositionRef.current -= 1;
        if (
          scrollPositionRef.current <=
          -newsContentWrapperRef.current.scrollWidth / 3
        ) {
          scrollPositionRef.current = 0;
        }
        newsContentWrapperRef.current.style.transform = `translateX(${scrollPositionRef.current}px)`;
      }
      animationFrameRef.current = requestAnimationFrame(scrollContent);
    };

    animationFrameRef.current = requestAnimationFrame(scrollContent);
  }, [isPaused, isDragging]);

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startAutoScroll]);

  const handleClick = () => {
    setIsPaused((prevState) => {
      if (!prevState && animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return !prevState;
    });
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX;
      const walk = (x - startX) * 1.5;
      scrollPositionRef.current = scrollLeft + walk;
      newsContentWrapperRef.current.style.transform = `translateX(${scrollPositionRef.current}px)`;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleMouseDown = (e) => {
    setIsDragging(true);
    newsContentWrapperRef.current.classList.add(styles.dragging);
    setStartX(e.pageX);
    setScrollLeft(scrollPositionRef.current);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    newsContentWrapperRef.current.classList.remove(styles.dragging);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

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
  ];

  const formatTanggal = (dateString) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div
      className={`${styles.newsContainer} ${isPaused ? styles.paused : ""}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={newsContentWrapperRef}
        className={`${styles.newsContentWrapper} ${
          isPaused ? styles.paused : ""
        }`}
      >
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

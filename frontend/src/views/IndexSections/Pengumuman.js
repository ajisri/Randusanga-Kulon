import React from "react";
import useSWR from "swr";
import { Image } from "primereact/image";
import styles from "../../assets/css/Pengumuman.module.css";

// Fungsi fetcher untuk mengambil data dari API
const fetcher = (url) => fetch(url).then((res) => res.json());

const Pengumuman = () => {
  const { data: pengumumanData, error: pengumumanError } = useSWR(
    "https://api.desarandusangakulon.com/pengumumanpengunjung",
    fetcher
  );

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
    <div className={`${styles.newsContainer}`}>
      <div className={`${styles.newsContentWrapper}`}>
        {tripledNewsItems.map((item, index) => (
          <div
            className={`${styles.newsItem} ${styles.fadeIn}`}
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
                src={`https://api.desarandusangakulon.com/${item.file_url}`}
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

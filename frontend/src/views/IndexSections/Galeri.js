import React, { useState, useEffect } from "react";
import useSWR from "swr";
import styles from "../../assets/css/Galeri.module.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Galeri = () => {
  const { data: galeriData, error } = useSWR(
    "http://localhost:8080/galeripengunjung",
    fetcher
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (galeriData && galeriData.galeris && galeriData.galeris.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex(
          (prevIndex) => (prevIndex + 1) % galeriData.galeris.length
        );
      }, 3000); // Ganti gambar setiap 3 detik

      return () => clearInterval(interval); // Membersihkan interval saat komponen di-unmount
    }
  }, [galeriData]);

  if (error) return <div>Error memuat data galeri</div>;
  if (!galeriData || !galeriData.galeris || galeriData.galeris.length === 0) {
    return <div>Tidak ada data galeri tersedia</div>;
  }

  // Fungsi untuk menghapus tag HTML
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const testimonials = galeriData.galeris.map((item) => ({
    image: `http://localhost:8080${item.file_url}`,
    title: item.title,
    content: stripHtml(item.content), // Gunakan stripHtml di sini
  }));

  return (
    <div className={styles.testimonialsContainer}>
      <div className={styles.imageContainer}>
        {testimonials.map((testimonial, index) => {
          let className = styles.inactive;
          if (index === activeIndex) {
            className = styles.active;
          } else if (
            index ===
            (activeIndex - 1 + testimonials.length) % testimonials.length
          ) {
            className = styles.previous;
          } else if (index === (activeIndex + 1) % testimonials.length) {
            className = styles.next;
          }

          return (
            <img
              key={index}
              src={testimonial.image}
              alt={testimonial.title}
              className={`${styles.testimonialImage} ${className}`}
            />
          );
        })}
      </div>
      <div className={styles.textContainer}>
        <h3>{testimonials[activeIndex].title}</h3>
        {/* Menampilkan konten yang sudah di-strip dari tag HTML */}
        <p>{testimonials[activeIndex].content}</p>
      </div>
    </div>
  );
};

export default Galeri;

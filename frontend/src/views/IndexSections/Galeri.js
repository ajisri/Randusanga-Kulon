import React, { useState, useEffect } from "react";
import useSWR from "swr";
import styles from "../../assets/css/Galeri.module.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Galeri = () => {
  const { data: testimonialsData, error } = useSWR(
    "http://localhost:8080/galeripengunjung",
    fetcher
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(
        (prevIndex) => (prevIndex + 1) % testimonialsData.galeris.length
      );
    }, 3000); // Ganti gambar setiap 3 detik

    return () => clearInterval(interval); // Membersihkan interval saat komponen di-unmount
  }, [testimonialsData]);

  if (error) return <div>Error memuat data testimonial</div>;
  if (!testimonialsData) return <div>Loading...</div>;

  const testimonials = testimonialsData.galeris.map((item) => ({
    image: `http://localhost:8080${item.file_url}`,
    title: item.title,
    // description: item.description,
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
        {/* <p>{testimonials[activeIndex].description}</p> */}
      </div>
    </div>
  );
};

export default Galeri;

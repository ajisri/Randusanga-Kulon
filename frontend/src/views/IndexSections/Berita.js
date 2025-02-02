import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Berita = () => {
  const { data: beritaData, error: beritaError } = useSWR(
    "https://randusanga-kulon.osc-fr1.scalingo.io/beritapengunjung",
    fetcher
  );

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [selectedBerita, setSelectedBerita] = useState(null);

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const formatTanggal = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString("id-ID", options);
  };

  if (beritaError)
    return <p style={{ textAlign: "center" }}>Gagal memuat data berita.</p>;
  if (!beritaData)
    return <p style={{ textAlign: "center" }}>Memuat berita...</p>;

  const styles = {
    "@import":
      "url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap')",

    container: {
      maxHeight: "800px",
      overflowY: "scroll",
      padding: "10px",
      gap: "20px",
      paddingRight: "30px",
      width: isSmallScreen ? "100%" : "95%",
      margin: "0 auto",
      height: "90vh",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "Roboto, sans-serif",
    },
    card: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      cursor: "pointer",
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "20px",
      transition: "box-shadow 0.3s ease",
      width: "95%",
      fontFamily: "Roboto, sans-serif",
    },
    cardHover: {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      fontFamily: "Roboto, sans-serif",
    },
    imageContainer: {
      width: isSmallScreen ? "100px" : "150px",
      height: isSmallScreen ? "100px" : "150px",
      borderRadius: "12px",
      overflow: "hidden",
      marginRight: "10px",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "12px",
    },
    content: {
      flex: "1",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      fontFamily: "Roboto, sans-serif",
    },
    title: {
      fontWeight: "bold",
      fontSize: isSmallScreen ? "0.9rem" : "1rem",
      margin: 0,
      fontFamily: "Roboto, sans-serif",
      color: "#333",
    },
    dialogDate: {
      fontFamily: "Roboto, sans-serif",
      color: "#060606",
      fontSize: "0.9rem",
      textAlign: "right",
      marginBottom: "10px",
    },
    dialogContent: {
      fontFamily: "'Roboto', sans-serif",
      color: "#000000", // Warna hitam solid
      lineHeight: "1.4",
    },
    date: {
      color: "#060606",
      fontSize: "0.9rem",
      marginTop: "5px",
      fontFamily: "Roboto, sans-serif",
    },
    description: {
      color: "#616161",
      fontSize: "1rem",
      marginTop: "10px",
      fontFamily: "Roboto, sans-serif",
      lineHeight: "1.5",
    },
    dialogImage: {
      width: "100%",
      height: "auto",
      maxHeight: isSmallScreen ? "200px" : "350px", // Meningkatkan max height
      objectFit: "cover", // Mengubah dari "contain" ke "cover" agar lebih pas
      borderRadius: "16px", // Membuat sudut lebih membulat
      marginBottom: "10px",
      backgroundColor: "#ffffff", // Menambahkan background putih
      padding: "8px", // Memberikan ruang di sekitar gambar agar terlihat lebih bersih
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Menambahkan bayangan lembut agar lebih menyatu dengan background
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

          .p-dialog-mask {
            backdrop-filter: blur(6px);
            background: rgba(0, 0, 0, 0.5) !important;
          }

          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            60% {
              opacity: 1;
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }

          .bounce-in {
            animation: bounceIn 1s ease-in-out;
          }

          .dialog-header {
          font-family: 'Roboto', sans-serif;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 1px solid #ccc;
          }

          .dialog-title {
          font-family: 'Roboto', sans-serif;
            font-size: 24px;
            margin: 0;
            color: #333;
          }

          .dialog-subtitle {
          font-family: 'Roboto', sans-serif;
            font-size: 14px;
            color: #777;
          }

          /* Custom Dialog Content */
          .custom-dialog {
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          body {
            font-family: 'Roboto', sans-serif;
            font-size: 16px; /* Ukuran font untuk teks */
            line-height: 1.5; /* Jarak antar baris untuk kenyamanan membaca */
            color: #333; /* Warna teks */
          }

          .dialog-text {
            font-family: 'Roboto', sans-serif;
            font-size: 16px; /* Ukuran font untuk teks panjang */
            line-height: 1.5; /* Jarak antar baris untuk kenyamanan membaca */
            color: #333; /* Warna teks */
          }

          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }

          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .error-message {
            color: #e74c3c;
            font-size: 16px;
            text-align: center;
          }
        `}
      </style>
      {beritaData.beritas && beritaData.beritas.length > 0 ? (
        beritaData.beritas.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedBerita(item)}
            style={styles.card}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = styles.cardHover.boxShadow)
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <div style={styles.imageContainer}>
              <img
                src={
                  `https://randusanga-kulon.osc-fr1.scalingo.io${item.file_url}` ||
                  "default-image-url.jpg"
                }
                alt={item.title}
                style={styles.image}
              />
            </div>
            <div style={styles.content}>
              <h4 style={styles.title}>{item.title}</h4>
              <p style={styles.description}>{item.short_description}</p>
              <span style={styles.date}>{formatTanggal(item.created_at)}</span>
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center" }}>Tidak ada data berita tersedia.</p>
      )}

      {selectedBerita && (
        <Dialog
          header={
            <div className="dialog-header">
              <div>
                <h2 className="dialog-title">{selectedBerita.title}</h2>
              </div>
            </div>
          }
          visible={!!selectedBerita}
          onHide={() => setSelectedBerita(null)}
          maximizable
          style={{ width: "55vw", fontFamily: "Roboto, sans-serif" }}
          className="custom-dialog bounce-in"
          contentStyle={{
            overflowY: "auto",
            padding: "24px 24px 10px 24px",
          }}
        >
          <img
            src={
              `https://randusanga-kulon.osc-fr1.scalingo.io${selectedBerita.file_url}` ||
              "default-image-url.jpg"
            }
            alt={selectedBerita.title}
            style={styles.dialogImage}
          />
          <div style={styles.dialogDate}>
            {formatTanggal(selectedBerita.created_at)}
          </div>
          <div
            style={styles.dialogContent}
            dangerouslySetInnerHTML={{ __html: selectedBerita.content }}
          />
        </Dialog>
      )}
    </div>
  );
};

export default Berita;

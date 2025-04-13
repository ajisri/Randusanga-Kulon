import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import useSWR from "swr";
import Tabs from "./Tabs.js";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Hero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = require("assets/font/soria-font.ttf");
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflowY = "auto";
    } else {
      document.body.style.overflowY = "visible";
    }
  }, [isMenuOpen]);

  const [isTextVisible, setIsTextVisible] = useState(false);

  useEffect(() => {
    setIsTextVisible(true);
  }, []);

  const { data: idmData, error: idmError } = useSWR(
    "https://ds-randusanga-kulon.osc-fr1.scalingo.io/indexdesamembangunpengunjung",
    fetcher
  );

  const loadingIdm = !idmData && !idmError;

  // Helper function untuk warna status
  const getStatusColor = (statusidm) => {
    const statusLower = statusidm.toLowerCase();
    if (statusLower.includes("mandiri")) {
      return { background: "rgba(25, 135, 84, 0.3)", color: "#28a745" };
    } else if (statusLower.includes("maju")) {
      return { background: "rgba(13, 110, 253, 0.3)", color: "#0d6efd" };
    } else if (statusLower.includes("berkembang")) {
      return { background: "rgba(255, 193, 7, 0.3)", color: "#ffc107" };
    } else if (statusLower.includes("tertinggal")) {
      return { background: "rgba(220, 53, 69, 0.3)", color: "#dc3545" };
    }
    return { background: "rgba(108, 117, 125, 0.3)", color: "#6c757d" };
  };

  const starsContainerStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "69%",
    overflow: "hidden",
    zIndex: 1,
    perspective: "1000px",
  };

  const staticStars = Array.from({ length: 25 }).map((_, index) => {
    const style = {
      position: "absolute",
      width: "2px",
      height: "2px",
      backgroundColor: "white",
      borderRadius: "50%",
      boxShadow: "0 0 5px white",
      opacity: 0.8,
      top: `${Math.random() * 69}%`,
      left: `${Math.random() * 100}%`,
      transform: `translateZ(${Math.random() * 1000}px)`,
    };
    return <div key={`static-${index}`} style={style}></div>;
  });

  const fallingStars = Array.from({ length: 5 }).map((_, index) => {
    const startX = Math.random() * 100;
    const duration = `${Math.random() * 5 + 18}s`;
    const delay = `${index * 8}s`;
    const style = {
      position: "absolute",
      width: "2px",
      height: "2px",
      backgroundColor: "white",
      borderRadius: "50%",
      boxShadow: "0 0 5px white",
      animation: "fallingStar 8s linear infinite",
      opacity: 0.8,
      top: `0%`,
      left: `${startX}%`,
      animationDuration: duration,
      animationDelay: delay,
    };
    return <div key={`falling-${index}`} style={style}></div>;
  });

  const StatusDesaCard = ({ idmData = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hovered, setHovered] = useState(false);

    // Handle empty data
    if (!idmData || idmData.length === 0) {
      return (
        <div
          style={{
            width: "100%",
            marginTop: "60px",
            padding: "20px",
            textAlign: "center",
            color: "white",
          }}
        >
          <div
            style={{
              background: "rgba(30, 30, 30, 0.8)",
              borderRadius: "12px",
              padding: "40px 20px",
              border: "2px dashed rgba(255, 255, 255, 0.3)",
            }}
          >
            <img
              src={require("assets/img/theme/data-not-found.png")}
              alt="No dataa"
              style={{ width: "80px", opacity: 0.7 }}
            />
            <h3
              style={{
                color: "#FFD700",
                marginTop: "20px",
                fontSize: "1.5rem",
              }}
            >
              Data Tidak Tersedia
            </h3>
            <p style={{ opacity: 0.8 }}>
              Data status desa belum dapat dimuat atau tidak tersedia
            </p>
            <Button
              color="warning"
              style={{
                marginTop: "20px",
                background: "rgba(255, 215, 0, 0.2)",
                border: "1px solid #FFD700",
              }}
              onClick={() => window.location.reload()}
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      );
    }

    const nextCard = () =>
      setCurrentIndex((prev) => (prev + 1) % idmData.length);
    const prevCard = () =>
      setCurrentIndex((prev) => (prev - 1 + idmData.length) % idmData.length);

    const currentItem = idmData[currentIndex];
    const statusColor = getStatusColor(currentItem.statusidm);

    return (
      <div
        style={{
          width: "100%",
          marginTop: "60px",
          position: "relative",
          padding: "0 20px",
        }}
      >
        {/* Year Navigation with Solid Design */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "30px",
            gap: "30px",
          }}
        >
          <NavigationArrow direction="left" onClick={prevCard} />

          <div
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              border: "2px solid rgba(255, 215, 0, 0.5)",
              borderRadius: "10px",
              padding: "12px 30px",
              minWidth: "150px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                color: "#FFD700",
                fontSize: "1.1rem",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              TAHUN
            </div>
            <div
              style={{
                color: "white",
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginTop: "5px",
              }}
            >
              {currentItem.ket || "-"}
            </div>
          </div>

          <NavigationArrow direction="right" onClick={nextCard} />
        </div>

        {/* Main Card Container */}
        <div
          style={{
            display: "flex",
            gap: "25px",
            justifyContent: "center",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          {/* Status Card - More Solid Design */}
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              flex: "1 1 300px",
              maxWidth: "380px",
              background: "rgba(30, 30, 30, 0.8)",
              borderRadius: "12px",
              padding: "25px",
              color: "white",
              boxShadow: hovered
                ? "0 10px 25px rgba(0, 0, 0, 0.5)"
                : "0 5px 15px rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(8px)",
              border: `2px solid ${
                statusColor.border || "rgba(255, 255, 255, 0.15)"
              }`,
              transition: "all 0.3s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              minHeight: "380px",
              transform: hovered ? "translateY(-5px)" : "none",
            }}
          >
            {/* Solid Status Header */}
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                height: "8px",
                background: statusColor.background,
                zIndex: 2,
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "15px 0 25px 0",
                    color: "#FFD700",
                    fontSize: "1.6rem",
                    textAlign: "center",
                    textShadow: "0 2px 8px rgba(255, 215, 0, 0.4)",
                    letterSpacing: "1px",
                    position: "relative",
                    paddingBottom: "15px",
                  }}
                >
                  STATUS DESA
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "80px",
                      height: "3px",
                      background:
                        "linear-gradient(90deg, transparent, #FFD700, transparent)",
                      borderRadius: "3px",
                    }}
                  />
                </h3>

                {/* Solid Status Indicator */}
                <div
                  style={{
                    padding: "25px 15px",
                    background: "rgba(0, 0, 0, 0.4)",
                    border: `2px solid ${statusColor.border || "#444"}`,
                    color: statusColor.color,
                    borderRadius: "10px",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "2.2rem",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "25px",
                    boxShadow: `inset 0 0 15px ${
                      statusColor.shadow || "rgba(0,0,0,0.3)"
                    }, 0 5px 15px rgba(0,0,0,0.3)`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {currentItem.statusidm || "Data Tidak Tersedia"}
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      right: "0",
                      bottom: "0",
                      background: statusColor.background,
                      opacity: "0.15",
                      zIndex: -1,
                    }}
                  />
                </div>
              </div>

              {/* Solid IDM Value Display */}
              <div
                style={{
                  background: "rgba(0, 50, 100, 0.3)",
                  border: "1px solid rgba(0, 120, 215, 0.3)",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                  boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  style={{
                    color: "#7FBFFF",
                    fontSize: "0.9rem",
                    marginBottom: "5px",
                  }}
                >
                  INDEKS DESA MEMBANGUN
                </div>
                <div
                  style={{
                    color: "white",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                  }}
                >
                  {currentItem.nilaiidm || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Indicators Panel - More Solid Design */}
          <div
            style={{
              flex: "1 1 300px",
              maxWidth: "380px",
              background: "rgba(30, 30, 30, 0.8)",
              borderRadius: "12px",
              padding: "25px",
              border: "2px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <h3
              style={{
                margin: "0 0 25px 0",
                color: "#FFD700",
                fontSize: "1.6rem",
                textAlign: "center",
                textShadow: "0 2px 8px rgba(255, 215, 0, 0.4)",
                letterSpacing: "1px",
                position: "relative",
                paddingBottom: "15px",
              }}
            >
              INDIKATOR
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "3px",
                  background:
                    "linear-gradient(90deg, transparent, #FFD700, transparent)",
                  borderRadius: "3px",
                }}
              />
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "15px",
                marginTop: "20px",
              }}
            >
              {[
                {
                  label: "IKL",
                  value: currentItem.ikl,
                  bg: "rgba(46, 125, 50, 0.3)",
                  border: "rgba(76, 175, 80, 0.5)",
                  color: "#A5D6A7",
                },
                {
                  label: "IKS",
                  value: currentItem.iks,
                  bg: "rgba(198, 40, 40, 0.3)",
                  border: "rgba(244, 67, 54, 0.5)",
                  color: "#EF9A9A",
                },
                {
                  label: "IKE",
                  value: currentItem.ike,
                  bg: "rgba(178, 138, 0, 0.3)",
                  border: "rgba(255, 193, 7, 0.5)",
                  color: "#FFF59D",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: item.bg,
                    border: `1px solid ${item.border}`,
                    borderRadius: "8px",
                    padding: "15px 10px",
                    textAlign: "center",
                    boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                    ":hover": {
                      transform: "translateY(-3px)",
                      boxShadow: `0 5px 15px ${item.border}`,
                    },
                  }}
                >
                  <div
                    style={{
                      color: item.color,
                      fontSize: "1rem",
                      fontWeight: "600",
                      marginBottom: "10px",
                      letterSpacing: "1px",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      color: "white",
                      fontSize: "1.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    {item.value || "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Arrow Component for Better Reusability
  const NavigationArrow = ({ direction, onClick }) => (
    <button
      onClick={onClick}
      style={{
        background: "rgba(255, 215, 0, 0.1)",
        border: "2px solid rgba(255, 215, 0, 0.5)",
        color: "#FFD700",
        fontSize: "1.5rem",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        backdropFilter: "blur(5px)",
        ":hover": {
          background: "rgba(255, 215, 0, 0.2)",
          transform: "scale(1.1)",
        },
      }}
    >
      {direction === "left" ? "←" : "→"}
    </button>
  );

  return (
    <div
      ref={heroRef}
      className="hero-container"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflowY: isMenuOpen ? "auto" : "hidden",
        pointerEvents: "auto",
        zIndex: 3,
        background: "linear-gradient(to bottom, #87CEEB, #FFFFFF)",
        animation: "backgroundGradient 5s infinite alternate",
      }}
    >
      <video
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
        }}
        autoPlay
        loop
        muted
        playsInline
        src={require("assets/img/theme/vi1.mp4")}
      ></video>

      <style>
        {`
          /* Scrollbar Styling */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.5);
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.7);
          }

          @keyframes fallingStar {
            0% {
              top: 0%;
              opacity: 1;
            }
            50% {
              top: 69%;
              opacity: 0;
            }
            100% {
              top: 69%;
              opacity: 0;
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.5);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }

          @keyframes dramaticText {
            0% {
              opacity: 0;
              transform: scale(0.5) translateY(-50px);
              text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }
            50% {
              opacity: 1;
              transform: scale(1.5) translateY(0);
              text-shadow: 0 0 30px rgba(255, 215, 0, 1);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
              text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }
          }

          @keyframes glow {
            0% {
              text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
            }
            50% {
              text-shadow: 0 0 30px rgba(255, 215, 0, 1);
            }
            100% {
              text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
            }
          }

          @keyframes backgroundGradient {
            0% {
              background: linear-gradient(45deg, #87CEEB, #FFFFFF);
            }
            50% {
              background: linear-gradient(45deg, #FFD700, #FFFFFF);
            }
            100% {
              background: linear-gradient(45deg, #87CEEB, #FFFFFF);
            }
          }

          /* Animasi untuk efek partikel */
          @keyframes particleFadeIn {
            0% {
              opacity: 0;
              transform: scale(0);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.2);
            }
            100% {
              opacity: 0.5;
              transform: scale(1);
            }
          }

          /* Tambahkan di dalam tag style */
.idm-container {
  transition: all 0.3s ease;
}

.idm-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.idm-value {
  font-size: 1.1rem;
  font-weight: 600;
}

@media (max-width: 992px) {
  .idm-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 576px) {
  .idm-grid {
    grid-template-columns: 1fr !important;
  }
}

          @media (max-width: 768px) {
            .hero-container {
              height: auto;
            }

            .tabs-container {
              width: 100%;
              padding: 0 8px;
              margin: 0;
              overflow-x: auto;
            }

            .custom-button {
              max-width: 90vw;
              height: auto;
              margin-bottom: 5px;
              padding: 2px;
            }

            .button-icon {
              min-height: 40px;
            }

            .icon-button-text {
              font-size: 12px;
            }

            .close-button {
              position: fixed;
              bottom: 10px;
              right: 10px;
              z-index: 1000;
            }

            .welcome-text {
              font-size: 12vw !important;
              line-height: 1.2;
            }

            .menu-button {
              font-size: 0.8rem !important;
              padding: 8px 16px !important;
            }

            .card-container {
              flex-direction: column !important;
              align-items: center !important;
            }

            .card {
              width: 90% !important;
              margin-bottom: 20px !important;
            }

            /* New styles for mobile layout */
            .mobile-content-order {
              display: flex;
              flex-direction: column;
            }

            .mobile-content-first {
              order: 1;
            }
          }
        `}
      </style>

      <Container
        fluid
        style={{ position: "relative", zIndex: 2, height: "100%" }}
      >
        {isMenuOpen ? (
          <>
            <Row
              style={{
                height: "100%",
                paddingTop: "0px",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                overflowY: "auto",
              }}
              className="mobile-content-order"
            >
              {/* Col md={8} content - now visible on mobile above the menu */}
              <Col
                md={8}
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  overflow: "auto",
                  order: 1, // Default order
                }}
                className="mobile-content-first"
              >
                {/* Bintang-bintang */}
                <div
                  style={{
                    ...starsContainerStyles,
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                >
                  {staticStars}
                  {fallingStars}
                </div>

                {/* Judul */}
                <div
                  style={{
                    fontFamily: "Soria, serif !important",
                    fontSize: "4vw",
                    fontWeight: "bold",
                    textAlign: "center",
                    margin: "20px 0 10px 0",
                    backgroundColor: "transparent",
                    color: "transparent",
                    background: "linear-gradient(45deg, #ffffff, #ffd700)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    textShadow: "2px 2px 8px rgba(255, 215, 0, 0.8)",
                    animation: "glow 3s infinite alternate",
                    zIndex: 2,
                    position: "relative",
                    paddingTop: "30px",
                  }}
                >
                  Randusanga Kulon
                </div>

                {/* Container Utama */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "900px",
                    marginTop: "5px",
                    position: "relative",
                    zIndex: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {loadingIdm ? (
                    <div style={{ color: "white", textAlign: "center" }}>
                      Memuat data...
                    </div>
                  ) : idmError ? (
                    <div style={{ color: "white", textAlign: "center" }}>
                      Gagal memuat data
                    </div>
                  ) : (
                    <StatusDesaCard
                      idmData={idmData?.IndexDesaMembangun || []}
                    />
                  )}
                </div>
              </Col>

              {/* Menu Column */}
              <Col
                md={4}
                style={{
                  padding: "20px 20px 80px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  height: "100%",
                  position: "relative",
                  zIndex: 2,
                  overflowY: "auto",
                  flex: "1 1 100%",
                  order: 2, // Default order
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <h3 style={{ color: "white", paddingTop: "20px" }}> </h3>
                  <img
                    alt="..."
                    src={require("assets/img/theme/Lambang_Kabupaten_Brebes.png")}
                    style={{
                      width: "70px",
                      height: "auto",
                      marginTop: "30px",
                    }}
                  />
                </div>

                <div
                  className="tabs-container"
                  style={{
                    width: "100%",
                    height: "100%",
                    margin: "0",
                    padding: "0 10px",
                    overflow: "auto",
                  }}
                >
                  <Tabs />
                </div>
                {isMenuOpen && (
                  <Button
                    onClick={() => setIsMenuOpen(false)}
                    className="close-button"
                    style={{
                      fontSize: "0.8rem",
                      padding: "8px 14px",
                      position: "absolute",
                      bottom: "30px",
                      right: "20px",
                      zIndex: 1000,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  >
                    Tutup
                  </Button>
                )}
              </Col>
            </Row>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <div
              className="welcome-text"
              style={{
                fontFamily: "Soria, serif",
                fontSize: "8vw",
                fontWeight: "bold",
                textShadow: "2px 2px 20px rgba(15, 15, 15, 0.8)",
                textAlign: "center",
                color: "transparent",
                WebkitTextStroke: "2px black",
                letterSpacing: "-2px",
                background: "linear-gradient(45deg, #ffffff)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                opacity: isTextVisible ? 1 : 0,
                animation:
                  "dramaticText 3s ease-in-out, glow 5s infinite alternate",
                transition: "opacity 2s ease-in-out",
              }}
            >
              Selamat Datang <br /> di Randusanga Kulon
            </div>
            <Button
              className="menu-button"
              onClick={() => setIsMenuOpen(true)}
              style={{
                fontSize: "1rem",
                padding: "10px 20px",
                marginTop: "20px",
                background: "linear-gradient(135deg, #f4e6d4, #d2b48c)",
                border: "none",
                borderRadius: "30px",
                color: "white",
                fontWeight: "bold",
                boxShadow: "0 0 10px rgba(210, 180, 140, 0.8)",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                animation: "pulse 2s infinite",
              }}
              onMouseOver={(e) => {
                e.target.style.boxShadow = "0 0 20px rgba(210, 180, 140, 1)";
              }}
              onMouseOut={(e) => {
                e.target.style.boxShadow = "0 0 10px rgba(210, 180, 140, 0.8)";
              }}
            >
              Buka Menu
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Hero;

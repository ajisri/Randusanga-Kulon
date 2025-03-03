import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Tabs from "./Tabs.js";

const Hero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(false);
  const [showWelcomeText, setShowWelcomeText] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = require("assets/font/soria-font.ttf");
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setIsInHeroSection(rect.top <= 0 && rect.bottom >= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflowY = "auto";
    } else {
      document.body.style.overflowY = "visible";
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeText(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const spaceStyles = {
    orbitContainer: {
      position: "relative",
      width: "100%",
      height: "40%",
      overflow: "visible",
      marginTop: "20px",
    },
    orbit: {
      position: "absolute",
      bottom: "0",
      left: "50%",
      border: "2px dashed rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      borderBottom: "none",
      borderLeft: "none",
      borderRight: "none",
      transform: "translateX(-50%) rotate(180deg)",
      width: "100%",
      height: "100%",
      animation: "rotateOrbit 20s linear infinite", // Animasi rotasi orbit
    },
    planet: {
      position: "absolute",
      bottom: "0",
      left: "50%",
      width: "30px",
      height: "30px",
      backgroundColor: "blue",
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
      animation: "orbitPlanet 10s linear infinite", // Animasi planet mengikuti orbit
    },
    star: {
      position: "absolute",
      width: "2px",
      height: "2px",
      backgroundColor: "white",
      borderRadius: "50%",
      boxShadow: "0 0 5px white",
      opacity: 0.8,
    },
    fallingStar: {
      position: "absolute",
      width: "2px",
      height: "2px",
      backgroundColor: "white",
      borderRadius: "50%",
      boxShadow: "0 0 5px white",
      animation: "fallingStar 8s linear infinite",
      opacity: 0.8,
    },
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
      ...spaceStyles.star,
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
      ...spaceStyles.fallingStar,
      top: `0%`,
      left: `${startX}%`,
      animationDuration: duration,
      animationDelay: delay,
    };
    return <div key={`falling-${index}`} style={style}></div>;
  });

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
        background: "linear-gradient(to bottom, #87CEEB, #FFFFFF)", // Latar belakang biru langit
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

          @keyframes rotateOrbit {
            0% {
              transform: translateX(-50%) rotate(0deg);
            }
            100% {
              transform: translateX(-50%) rotate(360deg);
            }
          }

          @keyframes orbitPlanet {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) translateX(150px) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg) translateX(150px) rotate(360deg);
            }
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

          @keyframes sandFall {
            0% { transform: translate(-50%, 0); opacity: 1; }
            100% { transform: translate(-50%, 50px); opacity: 0; }
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

            .orbitContainer {
              height: 50vh;
            }

            .orbit {
              width: 80% !important;
              height: 80% !important;
            }

            .welcome-text {
              font-size: 8vw !important; /* Perbesar tulisan pada layar kecil */
            }

            .menu-button {
              font-size: 0.8rem !important; /* Perkecil tombol pada layar kecil */
              padding: 8px 16px !important;
            }

            @keyframes glow {
              0% {
                text-shadow: 2px 2px 8px rgba(255, 215, 0, 0.8);
              }
              100% {
                text-shadow: 4px 4px 16px rgba(255, 215, 0, 1);
              }
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
            >
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
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <img
                    alt="..."
                    src={require("assets/img/theme/Lambang_Kabupaten_Brebes.png")}
                    style={{
                      width: "70px",
                      height: "auto",
                      marginTop: "10px",
                    }}
                  />
                  <h3 style={{ color: "white", paddingTop: "20px" }}>menu</h3>
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
                {isMenuOpen && isInHeroSection && (
                  <Button
                    onClick={() => setIsMenuOpen(false)}
                    className="close-button"
                    style={{
                      fontSize: "0.8rem",
                      padding: "8px 14px",
                      position: "fixed",
                      bottom: "30px",
                      right: "20px",
                      zIndex: 1000,
                      transition: "opacity 0.3s ease-in-out",
                      opacity: isInHeroSection ? 1 : 0,
                      pointerEvents: isInHeroSection ? "auto" : "none",
                    }}
                  >
                    Tutup
                  </Button>
                )}
              </Col>

              <Col
                md={8}
                className="d-none d-md-block"
                style={{
                  position: "relative",
                  padding: "20px 20px 40px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  flex: "1 1 100%",
                }}
              >
                <div style={starsContainerStyles}>
                  {staticStars}
                  {fallingStars}
                </div>
                <div
                  style={{
                    fontFamily: "Soria, serif !important",
                    fontSize: "5vw",
                    fontWeight: "bold",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "200px",
                    backgroundColor: "transparent",
                  }}
                >
                  Randusanga Kulon
                </div>
                <div
                  style={{
                    ...spaceStyles.planet,
                    width: "20px", // Diperkecil dari 30px
                    height: "20px", // Diperkecil dari 30px
                    transform:
                      "translate(-50%, -50%) rotate(0deg) translateX(100px) rotate(0deg)", // Sesuaikan jarak dari pusat orbit
                  }}
                ></div>
                <div style={spaceStyles.orbitContainer}>
                  {/* Orbit Terluar */}
                  <div
                    style={{
                      ...spaceStyles.orbit,
                      width: "80%", // Diperkecil dari 120%
                      height: "40%", // Diperkecil dari 60%
                      border: "2px solid rgba(255, 255, 255, 0.5)",
                      boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
                    }}
                  ></div>
                  {/* Orbit Kedua */}
                  <div
                    style={{
                      ...spaceStyles.orbit,
                      width: "60%", // Diperkecil dari 100%
                      height: "30%", // Diperkecil dari 50%
                      border: "2px solid rgba(255, 255, 255, 0.4)",
                      boxShadow: "0 0 15px rgba(255, 255, 255, 0.4)",
                    }}
                  ></div>
                  {/* Orbit Ketiga */}
                  <div
                    style={{
                      ...spaceStyles.orbit,
                      width: "40%", // Diperkecil dari 80%
                      height: "20%", // Diperkecil dari 40%
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
                    }}
                  ></div>
                  {/* Orbit Terkecil */}
                  <div
                    style={{
                      ...spaceStyles.orbit,
                      width: "20%", // Diperkecil dari 60%
                      height: "10%", // Diperkecil dari 30%
                      border: "2px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 0 5px rgba(255, 255, 255, 0.2)",
                    }}
                  ></div>
                </div>
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
            }}
          >
            {showWelcomeText && (
              <div
                className="welcome-text"
                style={{
                  fontFamily: "Soria, serif",
                  fontSize: "6vw",
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Bayangan teks untuk menonjolkan tulisan
                  textAlign: "center",
                  color: "transparent",
                  background: "linear-gradient(45deg, #ffffff, #ffd700)", // Gradien teks
                  WebkitBackgroundClip: "text", // Untuk browser WebKit (Chrome, Safari)
                  backgroundClip: "text",
                  animation: "glow 3s infinite alternate fadeIn 2s ease-in-out", // Animasi glow
                }}
              >
                Selamat Datang di Randusanga Kulon
              </div>
            )}
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
              {/* Efek Pasir Berjatuhan */}
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  width: "10px",
                  height: "10px",
                  background: "#f4e6d4",
                  borderRadius: "50%",
                  animation: "sandFall 1s infinite",
                }}
              ></div>
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Hero;

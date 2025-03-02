import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Tabs from "./Tabs.js";

const Hero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(false);
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
        const heroSection = heroRef.current;
        const rect = heroSection.getBoundingClientRect();
        setIsInHeroSection(rect.top <= 0 && rect.bottom >= 0);
      }
      if (window.scrollY > 500) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const spaceStyles = {
    orbitContainer: {
      position: "relative",
      width: "100%",
      height: "67%",
      overflow: "visible",
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
      animation: "orbit 10s linear infinite",
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
        overflow: "hidden",
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
                minHeight: "100vh",
                height: "auto",
                paddingTop: "0px",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <Col
                md={4}
                style={{
                  padding: "20px 20px 80px 20px", // Padding atas 20px, kanan 20px, bawah 80px, kiri 20px
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  height: "auto",
                  position: "relative",
                  zIndex: 2,
                  overflow: "visible",
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
                    height: "auto",
                    margin: "0",
                    padding: "0 10px", // Padding kanan dan kiri 10px
                    overflow: "visible",
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
                style={{
                  position: "relative",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "auto",
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
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
                <div style={spaceStyles.planet}></div>
                <div style={spaceStyles.orbitContainer}>
                  <div
                    style={{
                      ...spaceStyles.orbit,
                      width: "120%",
                      height: "60%",
                    }}
                  ></div>
                  <div
                    style={{
                      ...spaceStyles.orbit,
                      width: "100%",
                      height: "50%",
                    }}
                  ></div>
                  <div
                    style={{
                      ...spaceStyles.orbit,
                      width: "80%",
                      height: "40%",
                    }}
                  ></div>
                  <div
                    style={{
                      ...spaceStyles.orbit,
                      width: "60%",
                      height: "30%",
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
            }}
          >
            <Button
              onClick={() => setIsMenuOpen(true)}
              style={{ fontSize: "0.8rem", padding: "8px 14px" }}
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

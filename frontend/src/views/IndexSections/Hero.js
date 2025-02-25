import React, { useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Tabs from "./Tabs.js";

const Hero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const spaceStyles = {
    orbitContainer: {
      position: "relative",
      width: "100%",
      height: "50vh", // Setengah layar untuk orbit
      overflow: "hidden",
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
      transform: "translateX(-50%) rotate(180deg)", // Membalik orbit ke atas
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
      boxShadow: "0 0 5px white", // Efek cahaya bintang
      animation: "fallingStar 5s linear infinite", // Animasi bintang jatuh
      opacity: 0.8,
    },
  };

  // Container khusus untuk bintang
  const starsContainerStyles = {
    position: "absolute",
    top: 0, // Mulai dari atas layar
    left: 0,
    width: "100%",
    height: "50%", // Hanya 50% bagian atas
    overflow: "hidden",
    zIndex: 2,
    perspective: "1000px", // Menambahkan efek 3D
  };

  // Generate random stars hanya di setengah layar bagian atas
  const stars = Array.from({ length: 30 }).map((_, index) => {
    const depth = Math.random() * 1000; // Kedalaman 3D
    const duration = `${Math.random() * 3 + 2}s`; // Durasi animasi acak
    const style = {
      ...spaceStyles.star,
      top: `${Math.random() * 50}%`, // Bintang hanya berada di setengah layar atas
      left: `${Math.random() * 100}%`,
      animationDuration: duration, // Durasi animasi
      transform: `translateZ(${depth}px)`, // Efek 3D
    };
    return <div key={index} style={style}></div>;
  });

  return (
    <div
      className="hero-container"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Video Background */}
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

      <Container
        fluid
        style={{ position: "relative", zIndex: 2, height: "100%" }}
      >
        {isMenuOpen ? (
          <>
            {/* Baris Pertama */}
            <Row
              style={{ minHeight: "100vh", height: "auto", paddingTop: "0px" }}
            >
              <Col
                md={4}
                style={{
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  height: "auto",
                  position: "relative",
                  zIndex: 2,
                  overflowY: "auto",
                }}
              >
                {/* Logo Kabupaten Brebes */}
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
                  <h3 style={{ color: "white", paddingTop: "20px" }}>
                    {/* fjfj */}
                  </h3>
                </div>

                {/* Konten Tabs */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "900px",
                    height: "1200px",
                    margin: "0 auto",
                  }}
                >
                  <Tabs />
                </div>

                {/* Tombol Tutup */}
                <Button
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontSize: "0.8rem",
                    padding: "8px 14px",
                    marginTop: "20px",
                    alignSelf: "flex-end",
                    position: "absolute",
                    bottom: "20px",
                  }}
                >
                  Tutup
                </Button>
              </Col>

              {/* Kolom Orbit */}
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
                  backgroundColor: "rgba(0, 0, 0, 0.9)", // Overlay hitam nuansa luar angkasa
                }}
              >
                {/* Container khusus untuk bintang */}
                <div style={starsContainerStyles}>{stars}</div>

                {/* Planet yang Berputar */}
                <div style={spaceStyles.planet}></div>

                {/* Container untuk Orbit */}
                <div style={spaceStyles.orbitContainer}>
                  {/* Orbit Lebih Besar */}
                  <div
                    style={{
                      ...spaceStyles.orbit,
                      width: "1400px",
                      height: "700px",
                    }}
                  ></div>
                  <div
                    style={{
                      ...spaceStyles.orbit,
                      width: "1200px",
                      height: "600px",
                    }}
                  ></div>
                  <div
                    style={{
                      ...spaceStyles.orbit,
                      width: "1000px",
                      height: "500px",
                    }}
                  ></div>
                  <div
                    style={{
                      ...spaceStyles.orbit,
                      width: "800px",
                      height: "400px",
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

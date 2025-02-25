import React, { useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Tabs from "./Tabs.js";

const Hero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const spaceStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      zIndex: 3,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    orbitContainer: {
      position: "relative",
      width: "100%",
      height: "50%",
      overflow: "hidden",
    },
    orbit: {
      position: "absolute",
      bottom: "0",
      left: "50%",
      width: "300px",
      height: "150px",
      border: "2px dashed rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      borderBottom: "none",
      borderLeft: "none",
      borderRight: "none",
      transform: "translateX(-50%)",
    },
    planet: {
      position: "absolute",
      bottom: "0",
      left: "50%",
      width: "20px",
      height: "20px",
      backgroundColor: "blue",
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
      animation: "orbit 5s linear infinite",
    },
    star: {
      position: "absolute",
      width: "2px",
      height: "2px",
      backgroundColor: "white",
      borderRadius: "50%",
    },
  };

  // Generate random stars
  const stars = Array.from({ length: 100 }).map((_, index) => {
    const style = {
      ...spaceStyles.star,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
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
              style={{
                minHeight: "100vh",
                height: "auto",
                paddingTop: "0px",
              }}
            >
              <Col
                md={4}
                style={{
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 50px, rgba(0, 0, 0, 0) 100%)",
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
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
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
                    {/* Menu */}
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
                }}
              >
                {/* Overlay Hitam Nuansa Luar Angkasa */}
                <div style={spaceStyles.overlay}>
                  <div style={spaceStyles.orbitContainer}>
                    <div
                      style={{
                        ...spaceStyles.orbit,
                        width: "300px",
                        height: "150px",
                      }}
                    ></div>
                    <div
                      style={{
                        ...spaceStyles.orbit,
                        width: "250px",
                        height: "125px",
                      }}
                    ></div>
                    <div
                      style={{
                        ...spaceStyles.orbit,
                        width: "200px",
                        height: "100px",
                      }}
                    ></div>
                    <div style={{ ...spaceStyles.planet }}></div>
                    {stars}
                  </div>
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

import React, { useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Tabs from "./Tabs.js";

const Hero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              style={{ minHeight: "100vh", height: "auto", paddingTop: "0px" }}
            >
              <Col
                md={3}
                style={{
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 50px, rgba(0, 0, 0, 0) 100%)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100%",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "10px", // Jarak dari atas halaman
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 3, // Logo berada di atas konten lain
                  }}
                >
                  <img
                    alt="..."
                    src={require("assets/img/theme/Lambang_Kabupaten_Brebes.png")}
                    style={{
                      position: "absolute",
                      left: "50%",
                      paddingTop: "10px",
                      transform: "translateX(-50%)",
                      width: "70px", // Sesuaikan ukuran bendera
                      height: "auto",
                      top: "10px",
                      zIndex: 0, // Gambar di bawah
                    }}
                  />
                  <h3 style={{ color: "white", paddingTop: "20px", zIndex: 1 }}>
                    {/* Menu */}
                  </h3>
                </div>

                <div style={{ marginTop: "-220px" }}>
                  <Tabs />
                </div>
                <Button
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontSize: "0.8rem",
                    padding: "8px 14px",
                    position: "absolute", // Posisi absolut untuk memindahkan tombol ke bawah kanan
                    bottom: "20px", // Jarak dari bawah
                    right: "20px",
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
                  minHeight: "100%",
                }}
              >
                {/* Area tambahan jika diperlukan */}
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

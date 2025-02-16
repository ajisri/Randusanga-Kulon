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
            <Row style={{ minHeight: "50vh", height: "auto" }}>
              <Col
                md={4}
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100%",
                }}
              >
                <h3 style={{ color: "white" }}>Menu</h3>
                <Tabs />
                <Button
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontSize: "0.8rem",
                    padding: "8px 14px",
                    marginTop: "10px",
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

            {/* Baris Kedua */}
            <Row style={{ minHeight: "50vh", height: "auto" }}>
              <Col
                md={4}
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100%",
                }}
              >
                <p>Kolom Kiri</p>
              </Col>
              <Col
                md={4}
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100%",
                }}
              >
                <p>Kolom Tengah</p>
              </Col>
              <Col
                md={4}
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100%",
                }}
              >
                <p>Kolom Kanan</p>
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

import React, { useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";

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
            <Row style={{ height: "50%" }}>
              <Col
                md={3}
                style={{ backgroundColor: "rgba(0,0,0,0.6)", padding: "20px" }}
              >
                <h3 style={{ color: "white" }}>Menu</h3>
                <Button
                  onClick={() => setIsMenuOpen(false)}
                  style={{ fontSize: "0.7rem", padding: "6px 12px" }}
                >
                  Tutup
                </Button>
              </Col>
              <Col md={9} style={{ position: "relative" }}>
                {/* Video tetap di belakang */}
              </Col>
            </Row>

            {/* Baris Kedua */}
            <Row style={{ height: "50%" }}>
              <Col
                md={3}
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: "20px",
                }}
              >
                <p>Kolom Kiri</p>
              </Col>
              <Col
                md={6}
                style={{
                  backgroundColor: "rgba(255,255,255,0.4)",
                  padding: "20px",
                }}
              >
                <p>Kolom Tengah</p>
              </Col>
              <Col
                md={3}
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: "20px",
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
              style={{ fontSize: "0.7rem", padding: "6px 12px" }}
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

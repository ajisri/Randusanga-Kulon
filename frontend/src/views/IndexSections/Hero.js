import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import ReactTypingEffect from "react-typing-effect";
import Tabs from "./Tabs.js";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFast, setIsFast] = useState(false);

  const lasersRef = useRef([]);
  const lasersLeftRef = useRef([]);
  const [lasers, setLasers] = useState([]);
  const [lasersLeft, setLasersLeft] = useState([]);

  // Fungsi untuk menambahkan laser tanpa memicu re-render terus-menerus
  const addLaser = () => {
    const newLaser = {
      id: crypto.randomUUID(), // Menggunakan crypto untuk ID unik
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    };

    lasersRef.current = [...lasersRef.current.slice(-49), newLaser];
    setLasers([...lasersRef.current]);
  };

  const addLaserLeft = () => {
    const newLaser = {
      id: crypto.randomUUID(),
      top: `${Math.random() * 100}%`,
      left: "0%", // Mulai dari kiri
    };

    lasersLeftRef.current = [...lasersLeftRef.current.slice(-49), newLaser];
    setLasersLeft([...lasersLeftRef.current]);
  };

  useEffect(() => {
    const laserInterval = setInterval(addLaser, 500);
    const laserLeftInterval = setInterval(addLaserLeft, isFast ? 300 : 1500);

    return () => {
      clearInterval(laserInterval);
      clearInterval(laserLeftInterval);
    };
  }, [isFast]); // hanya akan mereset interval saat `isFast` berubah

  return (
    <div className="position-relative">
      <section className="section section-hero bg-gradient-cyan">
        <Container className="shape-container d-flex align-items-center justify-content-center py-lg">
          <div style={{ textAlign: "center", zIndex: 2 }} className="col px-0">
            <h3
              className="text-center font-weight-bold"
              style={{ fontSize: "1.5rem", color: "#fff" }}
            >
              Selamat Datang di Portal Desa{" "}
              <ReactTypingEffect
                text={["Randusanga Kulon"]}
                speed={100}
                eraseSpeed={50}
                eraseDelay={2000}
              />
            </h3>

            <Row className="align-items-center justify-content-center mt-4">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {/* Laser Beams */}
                {lasers.map((laser) => (
                  <span
                    key={laser.id}
                    className="laser"
                    style={{
                      position: "absolute",
                      width: "2px",
                      height: "2px",
                      top: laser.top,
                      left: laser.left,
                    }}
                  ></span>
                ))}

                {/* Laser Beams dari Kiri */}
                {lasersLeft.map((laser) => (
                  <span
                    key={laser.id}
                    className="laser-left"
                    style={{
                      position: "absolute",
                      width: "20px",
                      height: "5px",
                      top: laser.top,
                      left: laser.left,
                    }}
                  ></span>
                ))}

                <Button
                  onClick={() => {
                    setIsVisible(!isVisible);
                    setIsFast(!isFast);
                  }}
                  className={`btn-custom ${isFast ? "active" : ""}`}
                  block
                  size="lg"
                >
                  <span>
                    {isFast
                      ? "Menu Telah Dibuka"
                      : "Silahkan Klik Untuk Membuka Menu"}
                  </span>
                </Button>
              </div>
              <Col className="text-center" lg="12">
                {isVisible && <Tabs />}
                <p className="subtitle">
                  <strong>
                    Udang Vaname - Wisata Laut - Wisata Pemancingan - Kerang
                    Hijau - Ikan Bandeng - Rumput Laut
                  </strong>
                </p>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Hero;

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import ReactTypingEffect from "react-typing-effect";
import Tabs from "./Tabs.js";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lasers, setLasers] = useState([]);
  const [lasersLeft, setLasersLeft] = useState([]); // Laser dari kiri ke kanan
  const [isFast, setIsFast] = useState(false);

  // Menambahkan laser baru secara acak tanpa pola
  useEffect(() => {
    const interval = setInterval(() => {
      setLasers((prevLasers) => [
        ...prevLasers,
        {
          id: Math.random().toString(36).substr(2, 9), // ID unik
          top: `${Math.random() * 100}%`, // Posisi vertikal acak
          left: `${Math.random() * 100}%`, // Posisi horizontal acak
        },
      ]);

      // Batasi jumlah laser di state agar performa tetap optimal
      if (lasers.length > 50) {
        setLasers((prevLasers) => prevLasers.slice(-50));
      }
    }, Math.random() * 700 + 300); // Interval acak antara 300ms hingga 1000ms

    return () => clearInterval(interval); // Bersihkan interval saat komponen di-unmount
  }, [lasers]);

  // Laser dari kiri ke kanan dengan kecepatan dinamis
  useEffect(() => {
    const interval = setInterval(
      () => {
        setLasersLeft((prevLasers) => [
          ...prevLasers,
          {
            id: Math.random().toString(36).substr(2, 9), // ID unik
            top: `${Math.random() * 100}%`, // Posisi vertikal acak
            left: "0%", // Mulai dari sisi kiri
          },
        ]);

        if (lasersLeft.length > 50) {
          setLasersLeft((prevLasers) => prevLasers.slice(-50));
        }
      },
      isFast ? 300 : 1500
    ); // Kecepatan berubah berdasarkan isFast

    return () => clearInterval(interval);
  }, [lasersLeft, isFast]);

  const refaniFont = require("../../assets/font/Refani-Regular.otf");

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'Jaqueline';
            src: url(${refaniFont}) format('truetype');
          }

         @keyframes shakeText {
          0% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-1px); /* Pergeseran sedikit ke kiri */
          }
          40% {
            transform: translateX(1px); /* Pergeseran sedikit ke kanan */
          }
          60% {
            transform: translateX(-1px); /* Pergeseran sedikit ke kiri */
          }
          80% {
            transform: translateX(1px); /* Pergeseran sedikit ke kanan */
          }
          100% {
            transform: translateX(0);
          }
        }


          @keyframes movingNeonBorder {
          0% {
            border-top-color: #ff00ff;
            border-right-color: #ff00ff;
            border-bottom-color: #ff00ff;
            border-left-color: #ff00ff;
          }
          25% {
            border-top-color: #ff00ff;
            border-right-color: transparent;
            border-bottom-color: transparent;
            border-left-color: transparent;
          }
          50% {
            border-top-color: transparent;
            border-right-color: #ff00ff;
            border-bottom-color: transparent;
            border-left-color: transparent;
          }
          75% {
            border-top-color: transparent;
            border-right-color: transparent;
            border-bottom-color: #ff00ff;
            border-left-color: transparent;
          }
          100% {
            border-top-color: transparent;
            border-right-color: transparent;
            border-bottom-color: transparent;
            border-left-color: #ff00ff;
          }
        }

          @keyframes gradientMove {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes laserBeamInside {
            0% {
              left: 0; /* Mulai di kiri tombol */
              opacity: 1;
            }
            100% {
              left: 100%; /* Bergerak hingga ujung kanan tombol */
              opacity: 0;
            }
          }

          @keyframes laserBeam {
            0% {
              transform: translate(-50%, -50%) scale(0.5);
              opacity: 1;
            }
            50% {
              opacity: 0.7;
              transform: translate(-50%, -50%) scale(1.2);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
            }
          }

          @keyframes laserBeamRight {
            0% {
              transform: translateX(0);
              opacity: 1;
            }
            100% {
              transform: translateX(calc(100vw - var(--button-width))); /* Berhenti di sisi kanan tombol */
              opacity: 0;
            }
          }

          @keyframes laserBeamLeft {
            0% {
              transform: translateX(0);
              opacity: 1;
            }
            100% {
              transform: translateX(100vw);
              opacity: 0;
            }
          }

          .laser {
            position: absolute;
            width: 20px; /* Lebar memanjang */
            height: 5px; /* Tinggi lebih kecil */
            background: #ffffff;
            border-radius: 5px;
            animation: laserBeamInside 8s linear forwards;
            z-index: 2;
          }

          .laser-left {
            position: absolute;
            width: 20px; /* Lebar memanjang */
            height: 5px; /* Tinggi lebih kecil */
            background: #ffffff;
            border-radius: 5px;
            animation: laserBeamInside 2s linear forwards;
            z-index: 2;
          }

          .section-hero {
            position: relative;
            background: linear-gradient(120deg, #56ccf2, #f39c12);
            background-size: cover;
            padding: 80px 0;
            box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.3);
          }

          .hero-title {
            font-family: 'Jaqueline', sans-serif;
            font-size: 2.8rem; /* Font lebih besar dan dominan */
            font-weight: 800; /* Font tebal */
            color: #ffffff !important
            text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);;
            text-align: center;
            text-transform: uppercase;
            line-height: 1.4;
            letter-spacing: 2px;
            padding-bottom: 20px;
          }

          .btn-custom {
            overflow: hidden;
            font-family: 'Jaqueline', sans-serif;
            font-size: 1.2rem; /* Font lebih besar */
            padding: 20px 40px;
            background: linear-gradient(90deg, #56ccf2,rgb(203, 203, 17));
            border: none;
            color: white;
            text-transform: uppercase;
            border-radius: 50px;
            position: relative;
            overflow: hidden;
            animation: gradientMove 5s ease infinite;
            background-size: 300% 300%;
            text-align: center;
            display: inline-block;
            z-index: 1;
          }

          .btn-custom.active{
            background-color: #000000; /* Background gelap */
            color: #ffffff; /* Warna font putih */
            font-size: 0.9rem; /* Font lebih kecil */
            text-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff;
            border: 2px solid transparent;
            animation: movingNeonBorder 3s linear infinite; /* Animation for the moving neon border */
          }

          .btn-custom.active span {
            display: inline-block; /* Pastikan span bertindak sebagai block-level element */
            animation: shakeText 0.5s ease-in-out infinite; /* Apply shake animation */
          }

          .laser {
            position: absolute;
            width: 10px;
            height: 10px;
            background:rgb(247, 244, 247);
            border-radius: 50%;
            animation: laserBeam 1.5s ease-out forwards;
            z-index: 2;
          }

          .subtitle {
            font-family: 'Montserrat', sans-serif;
            font-size: 1.2rem;
            color: #f5f5f5;
            font-weight: 300;
            text-align: center;
            margin-top: 20px;
          }
        `}
      </style>

      <div className="position-relative">
        <section
          className="section section-hero bg-gradient-cyan embed-responsive"
          style={{ fontFamily: "Montserrat, sans-serif" }}
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
              filter: "brightness(80%)",
            }}
            autoPlay
            loop
            muted
            playsInline
            src={require("assets/img/theme/vi1.mp4")}
          ></video>

          <Container className="shape-container d-flex align-items-center justify-content-center py-lg">
            <div
              style={{
                zIndex: 2,
                textAlign: "center",
              }}
              className="col px-0"
            >
              <div className="hero-title">
                <h3 className="text-center font-weight-bold">
                  <span style={{ color: "#ffffff" }}>
                    Selamat Datang di Portal Desa{" "}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      whiteSpace: "nowrap",
                      minWidth: "250px",
                      textAlign: "left",
                    }}
                  >
                    <ReactTypingEffect
                      className="h3 text-center mr-1 font-weight-bold mt-6"
                      style={{ color: "#ffffff" }}
                      text={["Randusanga Kulon"]}
                      speed={100}
                      eraseSpeed={50}
                      eraseDelay={2000}
                      typingDelay={500}
                    />
                  </span>
                </h3>
              </div>

              <Row className="align-items-center justify-content-center mt-4">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {/* Laser Beams */}
                  {lasers.map((laser) => (
                    <span
                      key={laser.id}
                      className="laser"
                      style={{
                        top: laser.top,
                        left: laser.left,
                      }}
                    ></span>
                  ))}

                  {/* Laser Beams from Left */}
                  {lasersLeft.map((laser) => (
                    <span
                      key={laser.id}
                      className="laser-left"
                      style={{
                        top: laser.top,
                        left: laser.left,
                      }}
                    ></span>
                  ))}

                  <Button
                    onClick={() => {
                      setIsVisible(!isVisible);
                      setIsFast(!isFast); // Toggle the laser speed
                    }}
                    className={`btn-custom ${isFast ? "active" : ""}`}
                    block
                    size="lg"
                    type="button"
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
                      Udang Vaname-Wisata Laut-Wisata Pemancingan-Kerang
                      Hijau-Ikan Bandeng-Rumput Laut
                    </strong>
                  </p>
                </Col>
              </Row>
            </div>
          </Container>

          <div className="separator separator-bottom separator-skew zindex-100">
            <svg viewBox="0 0 120 28" xmlns="http://www.w3.org/2000/svg">
              <path
                className="bg-gradient-cyan"
                d="M0 20 Q 10 25, 20 20 T 40 20 T 60 20 T 80 20 T 100 20 T 120 20 V 30 H 0 Z"
                fill="#56ccf2"
              />
            </svg>
          </div>
        </section>
      </div>
    </>
  );
};

export default Hero;

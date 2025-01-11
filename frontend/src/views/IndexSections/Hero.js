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
              border-top-color: rgba(255, 255, 255, 0.8); /* Putih lembut */
              border-bottom-color: rgba(255, 215, 0, 0.8); /* Emas lembut */
              border-left-color: rgba(255, 140, 0, 0.8); /* Oranye terang */
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(144, 238, 144, 0.8), 0 0 40px rgba(255, 215, 0, 0.8), 0 0 50px rgba(255, 140, 0, 0.8), 0 0 60px rgba(238, 130, 238, 0.8);
            }
            25% {
              border-right-color: rgba(255, 215, 0, 0.8); /* Emas lembut */
              border-bottom-color: rgba(255, 140, 0, 0.8); /* Oranye terang */
              box-shadow: 0 0 20px rgba(144, 238, 144, 0.8), 0 0 30px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 140, 0, 0.8), 0 0 50px rgba(238, 130, 238, 0.8), 0 0 60px rgba(255, 255, 255, 0.8);
            }
            50% {
              border-top-color: rgba(255, 215, 0, 0.8); /* Emas lembut */
              border-right-color: rgba(255, 140, 0, 0.8); /* Oranye terang */
              border-left-color: rgba(255, 255, 255, 0.8); /* Putih lembut */
              box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 140, 0, 0.8), 0 0 40px rgba(238, 130, 238, 0.8), 0 0 50px rgba(255, 255, 255, 0.8), 0 0 60px rgba(144, 238, 144, 0.8);
            }
            75% {
              border-top-color: rgba(255, 140, 0, 0.8); /* Oranye terang */
              border-bottom-color: rgba(255, 255, 255, 0.8); /* Putih lembut */
              box-shadow: 0 0 20px rgba(255, 140, 0, 0.8), 0 0 30px rgba(238, 130, 238, 0.8), 0 0 40px rgba(255, 255, 255, 0.8), 0 0 50px rgba(144, 238, 144, 0.8), 0 0 60px rgba(255, 215, 0, 0.8);
            }
            100% {
              border-right-color: rgba(255, 255, 255, 0.8); /* Putih lembut */
              border-left-color: rgba(255, 215, 0, 0.8); /* Emas lembut */
              box-shadow: 0 0 20px rgba(238, 130, 238, 0.8), 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(144, 238, 144, 0.8), 0 0 50px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 140, 0, 0.8);
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

          
          .laser {
            position: absolute;
            width: 10px;
            height: 10px;
            background:rgb(247, 244, 247);
            border-radius: 50%;
            animation: laserBeam 1.5s ease-out forwards;
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
            background: linear-gradient(90deg, #56ccf2,rgb(245, 245, 237));
            border: none;
            color: white;
            text-transform: uppercase;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            animation: gradientMove 5s ease infinite;
            background-size: 300% 300%;
            text-align: center;
            display: inline-block;
            z-index: 1;
          }

          .btn-custom.active {
            background: rgba(0, 0, 0, 0); /* Transparansi murni */
            color: #ffffff; /* Warna teks tetap putih */
            font-size: 1rem;
            text-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff;
            border: 2px solid rgba(255, 255, 255, 0.8); /* Border putih transparan */
            box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.8);
            animation: movingNeonBorder 3s linear infinite;
            transform: scale(0.95);
          }

          .btn-custom.active::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 12px;
            border: 2px solid rgba(255, 255, 255, 0.8); /* Border neon */
            animation: movingNeonBorder 3s linear infinite;
            pointer-events: none;
            box-shadow: 0 0 15pxrgb(30, 246, 163), 0 0 30pxrgba(15, 132, 95, 0.93), 0 0 45pxrgb(204, 246, 19);
          }

          .btn-custom.active:hover {
            transform: scale(1.05); /* Efek membesar saat hover */
          }

          .btn-custom.active span {
            display: inline-block; /* Teks bertindak sebagai elemen blok */
            animation: shakeText 0.5s ease-in-out infinite; /* Animasi teks */
          }

          /* Untuk menambahkan efek shadow neon pada border */
          .btn-custom.active::after {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            border-radius: 12px; /* Sama dengan tombol */
            border: 2px solid transparent; /* Awalnya transparan */
            animation: movingNeonBorder 3s linear infinite; /* Animasi border */
            pointer-events: none; /* Mencegah interaksi dengan pseudo-element */
            box-shadow: 
              0 0 20px rgba(255, 255, 255, 0.8), /* Putih lembut */
              0 0 30px rgba(144, 238, 144, 0.8), /* Hijau pastel */
              0 0 40px rgba(255, 215, 0, 0.8),  /* Emas lembut */
              0 0 50px rgba(255, 140, 0, 0.8),  /* Oranye terang */
              0 0 60px rgba(238, 130, 238, 0.8); /* Ungu pastel */
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
              filter: "brightness(60%)",
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

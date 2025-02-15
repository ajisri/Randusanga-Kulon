import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import ReactTypingEffect from "react-typing-effect";
import Tabs from "./Tabs.js";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFast, setIsFast] = useState(false);
  const lasersRef = useRef([]);
  const lasersLeftRef = useRef([]);
  const starsRef = useRef([]);
  const [, forceRender] = useState(0); // Dummy state untuk paksa render
  const animationFrameRef = useRef(null);

  // Fungsi untuk menambah laser secara acak
  const spawnLasers = () => {
    if (lasersRef.current.length > 50) lasersRef.current.shift();
    lasersRef.current.push({
      id: Math.random().toString(36).substr(2, 9),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    });
    forceRender((prev) => prev + 1);
  };

  // Fungsi untuk menambah laser dari kiri ke kanan
  const spawnLasersLeft = () => {
    if (lasersLeftRef.current.length > 30) lasersLeftRef.current.shift();
    lasersLeftRef.current.push({
      id: Math.random().toString(36).substr(2, 9),
      top: `${Math.random() * 100}%`,
      left: "0%",
    });
    forceRender((prev) => prev + 1);
  };

  // Gunakan requestAnimationFrame untuk animasi yang lebih smooth
  useEffect(() => {
    let lastSpawnTime = performance.now();
    const animate = (time) => {
      if (time - lastSpawnTime > (isFast ? 200 : 800)) {
        spawnLasers();
        spawnLasersLeft();
        lastSpawnTime = time;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isFast]);

  // Membuat bintang jika isFast aktif
  useEffect(() => {
    if (isFast) {
      starsRef.current = Array.from({ length: 30 }).map(() => ({
        id: Math.random().toString(36).substr(2, 9),
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        depth: Math.random() * 1000,
        duration: `${Math.random() * 3 + 2}s`,
      }));
    } else {
      starsRef.current = [];
    }
    forceRender((prev) => prev + 1);
  }, [isFast]);

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
            0% { transform: translateX(0); }
            20% { transform: translateX(-1px); }
            40% { transform: translateX(1px); }
            60% { transform: translateX(-1px); }
            80% { transform: translateX(1px); }
            100% { transform: translateX(0); }
          }

          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes laserBeamInside {
            0% { left: 0; opacity: 1; }
            100% { left: 100%; opacity: 0; }
          }

          @keyframes spaceStars {
            0% { background-position: 0 0; }
            50% { background-position: 50% 50%; }
            100% { background-position: 0 0; }
          }

          @keyframes randomStars {
            0% { background-position: 0 0; }
            25% { background-position: 100px 50px; }
            50% { background-position: -100px -50px; }
            75% { background-position: 200px -100px; }
            100% { background-position: 0 0; }
          }
          
          .laser-left {
            position: absolute;
            width: 20px;
            height: 5px;
            background: #ffffff;
            border-radius: 5px;
            animation: laserBeamInside 2s linear forwards;
            z-index: 2;
          }

          .section-custom::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 50%;
            background: 
              radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 1%) 10% 20%, 
              radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 1%) 50% 50%, 
              radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 1%) 80% 30%, 
              radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 1%) 15% 80%, 
              radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 1%) 40% 60%;
            background-size: 150px 150px;
            pointer-events: none;
            z-index: 1;
          }

          .overlay-gradient-top {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 50%;
            background: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
            z-index: 2;
            pointer-events: none;
          }

          .overlay-gradient-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50%;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
            z-index: 2;
            pointer-events: none;
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
            font-size: 2.8rem;
            font-weight: 800;
            color: #ffffff;
            text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
            text-align: center;
            text-transform: uppercase;
            line-height: 1.4;
            letter-spacing: 2px;
            padding-bottom: 20px;
          }

          .btn-custom {
            overflow: hidden;
            font-family: 'Jaqueline', sans-serif;
            font-size: 1rem;
            padding: 12px 40px;
            background: linear-gradient(90deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1));
            border: none;
            color: white;
            text-transform: uppercase;
            border-radius: 12px;
            position: relative;
            animation: gradientMove 5s ease infinite;
            background-size: 300% 300%;
            text-align: center;
            display: inline-block;
          }

          .btn-custom:hover {
            background: rgba(0, 0, 0, 0);
            color: white;
          }

          .btn-custom::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
              radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 1%) 10% 20%, 
              radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 1%) 50% 50%, 
              radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 1%) 80% 30%, 
              radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 1%) 15% 80%, 
              radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 1%) 40% 60%;
            background-size: 150px 150px;
            pointer-events: none;
          }

          .btn-custom.active {
            background: #000000 !important;
            color: #ffffff;
            font-size: 1rem;
            text-shadow: 0 0 3px #ffffff, 0 0 5px #ffffff, 0 0 10px rgba(255, 255, 255, 0.6);
            border: 2px solid rgba(255, 255, 255, 0.6);
            box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.5),
                        0 0 15px 5px rgba(144, 238, 144, 0.5),
                        0 0 20px 5px rgba(255, 215, 0, 0.4);
            animation: spaceStars 10s infinite;
            transform: scale(0.95);
          }

          .btn-custom.active span {
            display: inline-block;
            animation: shakeText 0.5s ease-in-out infinite;
          }

          .subtitle {
            font-family: 'Montserrat', sans-serif;
            font-size: 1.2rem;
            color: #f5f5f5;
            font-weight: 300;
            text-align: center;
            margin-top: 20px;
          }

          .stars-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 50%;
            z-index: 2;
            perspective: 1000px;
            overflow: hidden;
          }

          .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 5px white;
            animation: flyThrough 4s linear infinite;
            opacity: 0.8;
          }

          @keyframes flyThrough {
            0% {
              transform: translateZ(1000px) translateY(0) translateX(0);
              opacity: 0;
            }
            50% { opacity: 1; }
            100% {
              transform: translateZ(-1000px) translateY(0) translateX(0);
              opacity: 0;
            }
          }
        `}
      </style>

      <div className="position-relative stars-container">
        <section
          className="section section-hero section-custom bg-gradient-cyan embed-responsive"
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
              filter: isFast ? "brightness(10%)" : "brightness(100%)",
            }}
            autoPlay
            loop
            muted
            playsInline
            src={require("assets/img/theme/vi1.mp4")}
          ></video>

          {lasersRef.current.map((laser) => (
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
            />
          ))}

          {lasersLeftRef.current.map((laser) => (
            <span
              key={laser.id}
              className="laser-left"
              style={{
                position: "absolute",
                width: "2px",
                height: "2px",
                top: laser.top,
                left: laser.left,
              }}
            />
          ))}

          {starsRef.current.map((star) => (
            <div
              key={star.id}
              className="star"
              style={{
                top: star.top,
                left: star.left,
                animationDuration: star.duration,
                transform: `translateZ(${star.depth}px)`,
              }}
            />
          ))}

          <div className="overlay-gradient-top"></div>
          <div className="overlay-gradient-bottom"></div>

          {isVisible ? (
            // Layout grid baru saat menu dibuka
            <Container
              fluid
              className="menu-grid-container"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 3,
                height: "100%",
              }}
            >
              {/* Baris pertama: 2 kolom (20% & 80%) */}
              <Row style={{ height: "50%" }}>
                <Col
                  style={{ flexBasis: "20%", maxWidth: "20%" }}
                  className="p-0"
                >
                  <Tabs />
                </Col>
                <Col
                  style={{ flexBasis: "80%", maxWidth: "80%" }}
                  className="p-0"
                >
                  <div
                    className="hero-title"
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      marginTop: "150px",
                    }}
                  >
                    <h3 style={{ fontSize: "1.5rem" }}>
                      Selamat Datang di Portal Desa{" "}
                      <ReactTypingEffect
                        className="h3 text-center mr-1 font-weight-bold mt-6"
                        style={{ color: "#ffffff", fontSize: "1.5rem" }}
                        text={["Randusanga Kulon"]}
                        speed={100}
                        eraseSpeed={50}
                        eraseDelay={2000}
                        typingDelay={500}
                      />
                    </h3>
                  </div>
                </Col>
              </Row>
              {/* Baris kedua: 3 kolom (20%, 60%, 20%) */}
              <Row style={{ height: "50%" }}>
                <Col
                  style={{ flexBasis: "20%", maxWidth: "20%" }}
                  className="p-0"
                >
                  {/* Placeholder atau konten tambahan */}
                </Col>
                <Col
                  style={{ flexBasis: "60%", maxWidth: "60%" }}
                  className="p-0"
                >
                  {/* Placeholder atau konten tambahan */}
                </Col>
                <Col
                  style={{ flexBasis: "20%", maxWidth: "20%" }}
                  className="p-0"
                >
                  {/* Placeholder atau konten tambahan */}
                </Col>
              </Row>
              {/* Tombol kecil untuk menutup menu */}
              <div
                style={{ position: "absolute", top: "150px", right: "10px" }}
              >
                <Button
                  onClick={() => {
                    setIsVisible(false);
                    setIsFast(false);
                  }}
                  className={`btn-custom ${isFast ? "active" : ""}`}
                  size="sm"
                  type="button"
                >
                  <span>Tutup Menu</span>
                </Button>
              </div>
            </Container>
          ) : (
            // Layout semula saat menu belum dibuka
            <Container className="shape-container d-flex align-items-center justify-content-center py-lg">
              <div
                style={{ zIndex: 2, textAlign: "center" }}
                className="col px-0"
              >
                <div className="hero-title">
                  <h3
                    className="text-center font-weight-bold"
                    style={{ fontSize: "1.5rem" }}
                  >
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
                        style={{ color: "#ffffff", fontSize: "1.5rem" }}
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
                    <Button
                      onClick={() => {
                        setIsVisible(true);
                        setIsFast(true);
                      }}
                      className={`btn-custom ${isFast ? "active" : ""}`}
                      block
                      size="lg"
                      type="button"
                    >
                      <span>Silahkan Klik Untuk Membuka Menu</span>
                    </Button>
                  </div>
                  <Col className="text-center" lg="12">
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
          )}

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

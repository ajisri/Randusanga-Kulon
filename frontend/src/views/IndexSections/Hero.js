import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Container, Row, Col, Button } from "reactstrap";
import ReactTypingEffect from "react-typing-effect";
import Tabs from "./Tabs.js";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lasers, setLasers] = useState([]);
  const [lasersLeft, setLasersLeft] = useState([]);
  const [isFast, setIsFast] = useState(false);

  const animationFrameRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);

  const generateLaser = useCallback(() => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    };
  }, []);

  const generateLaserLeft = useCallback(() => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      top: `${Math.random() * 100}%`,
      left: "0%",
    };
  }, []);

  const updateLasers = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current > 500) {
      // Update every 500ms
      setLasers((prevLasers) => {
        const newLasers = [...prevLasers.slice(-49), generateLaser()];
        return newLasers;
      });

      setLasersLeft((prevLasers) => {
        const newLasers = [...prevLasers.slice(-49), generateLaserLeft()];
        return newLasers;
      });

      lastUpdateTimeRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(updateLasers);
  }, [generateLaser, generateLaserLeft]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateLasers);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [updateLasers]);

  const stars = useMemo(() => {
    if (isFast) {
      return Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            transform: `translateZ(${Math.random() * 1000}px)`,
          }}
        />
      ));
    }
    return [];
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
            color: #ffffff !important;
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
            font-size: 1.2rem;
            padding: 20px 40px;
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
            box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.5), 0 0 15px 5px rgba(144, 238, 144, 0.5), 0 0 20px 5px rgba(255, 215, 0, 0.4);
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
            animation: flyThrough 4s linear infinite;
            opacity: 0.8;
          }

          @keyframes flyThrough {
            0% {
              transform: translateZ(1000px) translateY(0) translateX(0);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateZ(-1000px) translateY(calc(100vh * (random() - 0.5))) translateX(calc(100vw * (random() - 0.5)));
              opacity: 0;
            }
          }
        `}
      </style>

      <div className="position-relative">
        <section
          className="section section-hero section-custom bg-gradient-cyan embed-responsive"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          <div className="stars-container">{stars}</div>
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
          <div className="overlay-gradient-top"></div>
          <div className="overlay-gradient-bottom"></div>

          <Container className="shape-container d-flex align-items-center justify-content-center py-lg">
            <div
              style={{
                zIndex: 2,
                textAlign: "center",
              }}
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

                  {lasersLeft.map((laser) => (
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
                    type="button"
                  >
                    <div className="stars-container">{stars}</div>
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

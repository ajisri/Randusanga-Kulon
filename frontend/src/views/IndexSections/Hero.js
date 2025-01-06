import React from "react";
import ReactTypingEffect from "react-typing-effect";

// import { Link } from "react-router-dom";
import Tabs from "./Tabs.js";

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";
// import Videofull from "./Videofull.js";

class Hero extends React.Component {
  constructor(props) {
    super(props);
    // Mengatur state awal
    this.state = {
      isVisible: false,
    };
  }

  // Fungsi untuk toggle visibilitas
  toggleVisibility = () => {
    this.setState((prevState) => ({
      isVisible: !prevState.isVisible,
    }));
  };

  render() {
    return (
      <>
        <style>
          {`
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

            @keyframes laserBeam {
              0% {
                left: -100%;
                top: calc(0% + (random() * 100%)); /* Random Y position */
                opacity: 1;
              }
              50% {
                left: 50%;
                top: calc(0% + (random() * 100%)); /* Random Y position */
                opacity: 0.7;
              }
              100% {
                left: 100%;
                top: calc(0% + (random() * 100%)); /* Random Y position */
                opacity: 0;
              }
            }

            /* Gradient Text */
            .gradient-text {
              font-family: 'Montserrat', sans-serif;
              font-size: 3.5rem;
              font-weight: bold;
              background: linear-gradient(90deg, #a7a8aa, #56ccf2, #6a11cb);
              background-size: 300% 300%;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: gradientMove 5s ease infinite;
              text-align: center;
              margin: 20px 0;
              letter-spacing: 1px;
            }

            /* Hero Section Styling */
            .section-hero {
              position: relative;
              background: url('assets/img/theme/grey-sky.jpg') no-repeat center center fixed;
              background-size: cover;
              padding: 80px 0;
              box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.3);
            }

            /* Title Style */
            .hero-title {
              font-family: 'Montserrat', sans-serif;
              font-size: 2.5rem;
              font-weight: 700;
              color: #ffffff;
              text-align: center;
              text-transform: uppercase;
              line-height: 1.4;
              letter-spacing: 2px;
              padding-bottom: 20px;
            }

            /* Button Style with Gradient and Animation */
            .btn-custom {
              font-family: 'Montserrat', sans-serif;
              font-size: 1.2rem;
              padding: 15px 30px;
              background: linear-gradient(90deg, #56ccf2, #6a11cb);
              border: none;
              color: white;
              text-transform: uppercase;
              border-radius: 50px;
              position: relative;
              overflow: hidden;
              animation: gradientMove 5s ease infinite;
              background-size: 300% 300%; /* Ensure gradient animation */
              text-align: center;
              display: inline-block;
              z-index: 2;
              width: 100%;
            }

            .btn-custom:active {
              transform: scale(0.95);
            }

            /* Laser Beam Effect - Multiple beams with random Y position */
            .btn-custom::before,
            .btn-custom::after,
            .btn-custom .laser-3,
            .btn-custom .laser-4 {
              content: '';
              position: absolute;
              width: 5px;
              height: 10px;
              background: #ff00ff; /* Laser color */
              transform: translateY(-50%);
              opacity: 0;
              animation: laserBeam 4s linear infinite;
            }

            .btn-custom::before {
              left: 10%;
              animation-delay: 0s; /* First beam */
            }

            .btn-custom::after {
              left: 30%;
              animation-delay: 0.5s; /* Second beam */
            }

            .btn-custom .laser-3 {
              left: 50%;
              animation-delay: 1s; /* Third beam */
            }

            .btn-custom .laser-4 {
              left: 70%;
              animation-delay: 1.5s; /* Fourth beam */
            }

            .subtitle {
              font-family: 'Montserrat', sans-serif;
              font-size: 1.1rem;
              color: #ffffff;
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
                filter: "brightness(50%)",
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
                    <span>Selamat Datang di Portal Desa</span>
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
                        text={["Randusanga Kulon"]}
                        speed={100}
                        eraseSpeed={50}
                        eraseDelay={2000}
                        typingDelay={500}
                      />
                    </span>
                  </h3>

                  {/* Gradient Text */}
                  <div className="gradient-text">Portal Wisata & Budaya</div>
                </div>

                <Row className="align-items-center justify-content-center mt-4">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Button
                      onClick={this.toggleVisibility}
                      className="btn-custom"
                      block
                      size="lg"
                      type="button"
                    >
                      Silahkan Klik Untuk Membuka Menu
                    </Button>
                  </div>
                  <Col className="text-center" lg="12">
                    {this.state.isVisible && <Tabs />}
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

            {/* SVG Separator */}
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
  }
}

export default Hero;

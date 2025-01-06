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

            .gradient-text {
              font-size: 2.5rem;
              font-weight: bold;
              background: linear-gradient(90deg, #ff6ec4, #7873f5, #4dd0e1);
              background-size: 300% 300%;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: gradientMove 3s ease infinite;
              text-align: center;
              margin: 20px 0;
            }
          `}
        </style>
        <div className="position-relative">
          {/* Hero Section */}
          <section
            className="section section-hero bg-gradient-cyan embed-responsive"
            style={{ fontFamily: "Nautical, sans-serif" }}
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
            <Container className="shape-container d-flex align-items-center justify-content-center py-lg">
              <div
                style={{
                  zIndex: 2,
                }}
                className="col px-0"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "Nautical, sans-serif",
                    fontWeight: "700",
                    fontSize: "2.5rem",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "#004D40",
                    textAlign: "center",
                    lineHeight: "1.3",
                    paddingBottom: "10px",
                  }}
                  className="responsive-title text-center"
                >
                  <h3 className="text-center font-weight-bold">
                    <span>Selamat Datang di Portal Desa </span>
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

                <Row className="align-items-center justify-content-center mt-2">
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
                      style={{ width: "100%" }}
                      block
                      color="secondary"
                      size="lg"
                      type="button"
                    >
                      Silahkan Klik Untuk Membuka Menu
                    </Button>
                  </div>
                  <Col className="text-center" lg="12">
                    {this.state.isVisible && <Tabs />}
                    <p className="lead text-white">
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
                  fill="#4da6ff"
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

import React from "react";
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import Modals from "./Modals";
import Modall from "./Modall";
import Modalt from "./Modalt";

class TabsSection extends React.Component {
  state = {
    plainTabs: 1,
    cursorPosition: { x: 0, y: 0 },
    isHovering: null,
    pieces: {
      1: [],
      2: [],
      3: [],
    },
    numPieces: 900,
    animationKeys: {
      1: Date.now(),
      2: Date.now(),
      3: Date.now(),
    },
  };

  componentDidMount() {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("touchmove", this.handleTouchMove);
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("touchmove", this.handleTouchMove);
  }

  handleMouseMove = (e) => {
    this.setState({ cursorPosition: { x: e.clientX, y: e.clientY } });
  };

  handleTouchMove = (e) => {
    const touch = e.touches[0]; // Ambil sentuhan pertama
    this.setState({ cursorPosition: { x: touch.clientX, y: touch.clientY } });
  };

  toggleNavs = (e, state, index) => {
    e.preventDefault();

    this.setState({
      [state]: index,
      activeIcon: index,
      animationKeys: {
        ...this.state.animationKeys,
        [index]: Date.now(),
      },
      pieces: {
        ...this.state.pieces,
        [index]: this.generatePieces(),
      },
    });
  };

  generatePieces = () => {
    const pieces = [];
    const size = 50;
    const cols = Math.ceil(Math.sqrt(this.state.numPieces));
    const rows = Math.ceil(this.state.numPieces / cols);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        pieces.push({
          id: row * cols + col,
          style: this.horizontalPieceStyle(row, col, size, cols),
        });
      }
    }
    return pieces;
  };

  horizontalPieceStyle = (row, col, size, cols) => {
    const centerX = cols / 4;
    const direction = col < centerX ? -1 : 1; // Tentukan arah (kiri atau kanan)
    const distance = Math.abs(centerX - col) / centerX;

    return {
      position: "absolute",
      width: `${size}px`,
      height: `${size}px`,
      background: `rgba(255, 105, 180, ${Math.random() * 0.5 + 0.5})`,
      top: `${row * size}px`,
      left: `${centerX * size}px`, // Semua mulai dari tengah
      transform: "translate(-50%, -50%)",
      opacity: 1,
      animation: `horizontal-fly-out 2s forwards`,
      animationDelay: `${distance * 0.2}s`,
      "--direction": direction,
    };
  };

  render() {
    const { cursorPosition, isHovering } = this.state;
    return (
      <>
        <style>
          {`
            .custom-cursor {
              position: fixed;
              width: 150px;
              height: 150px;
              border-radius: 50%;
              pointer-events: none;
              transform: translate(-50%, -50%);
              z-index: 9999;
              display: none;
              mix-blend-mode: difference;
            }

            .custom-cursor.show {
              display: block;
            }

            .cursor-icon {
              font-size: 140px;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
            }
          
            .futuristik-nav-link {
              position: relative;
              overflow: hidden;
              display: inline-block;
              width: 100%;
              padding: 15px 25px;
              font-size: 1.2rem;
              text-align: center;
              margin-left: 17px;
              border-radius: 12px;
              color:rgb(84, 83, 83) !important;
              background: linear-gradient(135deg, #2c2c54, #40407a);
              border: 1px solid #f5f5f5;
              transition: all 0.4s ease-in-out;
            }

            .futuristik-nav-link.active {
              color: #000000 !important;
              background: #ffffff !important;
              border-color: transparent !important;
              box-shadow: 0 0 10px rgba(255, 255, 255, 0.6),
                          0 0 20px rgba(255, 255, 255, 0.5) !important;
            }

            .futuristik-nav-link:hover {
              cursor: none;
              background: rgba(255, 255, 255, 0.1);
              color: rgb(58, 57, 57) !important;
              border: 2px solid #fffa65;
              box-shadow: 0 0 15px rgba(255, 255, 255, 0.8),
                          0 0 25px rgba(238, 130, 238, 0.7),
                          0 0 45px rgba(0, 255, 255, 0.7);
              transition: all 0.1s ease-in-out;
            }

            @keyframes horizontal-fly-out {
              0% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 1;
                transform: translateX(calc(550px * var(--direction))) scale(2.5);
              }
              100% {
                opacity: 0;
                transform: translateX(calc(550px * var(--direction))) scale(0.5);
              }
            }
            
            /* RESPONSIVE STYLING */
            @media (max-width: 768px) {
              .nav-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
              }

              .custom-cursor {
                display: block; /* Pastikan kursor tetap terlihat di mobile */
              }

              .futuristik-nav-link {
                width: 80%;
                padding: 10px 20px;
                font-size: 1rem;
              }

              .futuristik-nav-link:hover {
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.6),
                            0 0 15px rgba(238, 130, 238, 0.5),
                            0 0 25px rgba(0, 255, 255, 0.5);
              }
            }

            @media (max-width: 576px) {
              .nav-wrapper {
                flex-direction: column;
                align-items: center;
              }

              .custom-cursor {
                display: block; /* Pastikan kursor tetap terlihat di mobile */
              }

              .futuristik-nav-link {
                width: 100%;
                padding: 8px 15px;
                font-size: 0.9rem;
                margin-left: 15px;
              }
            }
          `}
        </style>
        <div
          className={`custom-cursor ${isHovering ? "show" : ""}`}
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y - 110}px`,
          }}
        >
          {isHovering === "profile" && <div className="cursor-icon">🗺️</div>}
          {/* Icon for "Profil Desa" */}
          {isHovering === "services" && (
            <div className="cursor-icon">📦</div>
          )}{" "}
          {/* Icon for "Layanan Desa" */}
          {isHovering === "transparency" && (
            <div className="cursor-icon">📜</div>
          )}{" "}
          {/* Icon for "Transparansi Desa" */}
        </div>

        <Row className="justify-content-center">
          <Col lg="12" className="mt-5 mt-lg-0">
            <div className="mb-3">
              <small className="text-uppercase font-weight-bold">Menu</small>
            </div>
            <div className="nav-wrapper">
              <Nav
                className="nav-fill flex-md-row"
                id="tabs-icons-text"
                pills
                role="tablist"
              >
                <Row className="w-100">
                  <Col lg="4" className="mb-3">
                    <NavItem>
                      <NavLink
                        aria-selected={this.state.plainTabs === 1}
                        className={classnames("futuristik-nav-link", {
                          active: this.state.plainTabs === 1,
                        })}
                        onClick={(e) => this.toggleNavs(e, "plainTabs", 1)}
                        onMouseEnter={() =>
                          this.setState({ isHovering: "profile" })
                        }
                        onMouseLeave={() => this.setState({ isHovering: null })}
                        href="#pablo"
                        role="tab"
                      >
                        <b>PROFIL</b>
                        {this.state.pieces[1]?.map((piece) => (
                          <div
                            key={`${piece.id}-${this.state.animationKeys[1]}`}
                            className="horizontal-fly-out"
                            style={piece.style}
                          ></div>
                        ))}
                      </NavLink>
                    </NavItem>
                  </Col>
                  <Col lg="4" className="mb-3">
                    <NavItem>
                      <NavLink
                        aria-selected={this.state.plainTabs === 2}
                        className={classnames("futuristik-nav-link", {
                          active: this.state.plainTabs === 2,
                        })}
                        onClick={(e) => this.toggleNavs(e, "plainTabs", 2)}
                        onMouseEnter={() =>
                          this.setState({ isHovering: "services" })
                        }
                        onMouseLeave={() => this.setState({ isHovering: null })}
                        href="#pablo"
                        role="tab"
                      >
                        <b>LAYANAN</b>
                        {this.state.pieces[2]?.map((piece) => (
                          <div
                            key={`${piece.id}-${this.state.animationKeys[2]}`}
                            className="horizontal-fly-out"
                            style={piece.style}
                          ></div>
                        ))}
                      </NavLink>
                    </NavItem>
                  </Col>
                  <Col lg="4" className="mb-3">
                    <NavItem>
                      <NavLink
                        aria-selected={this.state.plainTabs === 3}
                        className={classnames("futuristik-nav-link", {
                          active: this.state.plainTabs === 3,
                        })}
                        onClick={(e) => this.toggleNavs(e, "plainTabs", 3)}
                        onMouseEnter={() =>
                          this.setState({ isHovering: "transparency" })
                        }
                        onMouseLeave={() => this.setState({ isHovering: null })}
                        href="#pablo"
                        role="tab"
                      >
                        <b>TRANSPARANSI</b>
                        {this.state.pieces[3]?.map((piece) => (
                          <div
                            key={`${piece.id}-${this.state.animationKeys[3]}`}
                            className="horizontal-fly-out"
                            style={piece.style}
                          ></div>
                        ))}
                      </NavLink>
                    </NavItem>
                  </Col>
                </Row>
              </Nav>
            </div>

            <TabContent activeTab={"plainTabs" + this.state.plainTabs}>
              <TabPane tabId="plainTabs1">
                <Modals />
              </TabPane>
              <TabPane tabId="plainTabs2">
                <Modall />
              </TabPane>
              <TabPane tabId="plainTabs3">
                <Modalt />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </>
    );
  }
}

export default TabsSection;

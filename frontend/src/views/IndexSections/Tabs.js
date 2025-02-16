import React, { Component } from "react";
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
import Modals from "./Modals"; // Sesuaikan dengan import yang benar
import Modall from "./Modall";
import Modalt from "./Modalt";

class TabsSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plainTabs: 1,
      cursorPosition: { x: 0, y: 0 },
      pieces: { 1: [], 2: [], 3: [] },
      numPieces: 100,
      animationKeys: { 1: Date.now(), 2: Date.now(), 3: Date.now() },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.plainTabs !== this.state.plainTabs ||
      nextState.animationKeys !== this.state.animationKeys ||
      nextState.pieces !== this.state.pieces
    );
  }

  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState((prevState) => ({
      [state]: index,
      animationKeys: { ...prevState.animationKeys, [index]: Date.now() },
      pieces: { ...prevState.pieces, [index]: this.generatePieces() },
    }));
  };

  generatePieces = () => {
    const size = 50;
    const cols = Math.ceil(Math.sqrt(this.state.numPieces));
    return Array.from({ length: this.state.numPieces }, (_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      return {
        id: i,
        style: this.horizontalPieceStyle(row, col, size, cols),
      };
    });
  };

  horizontalPieceStyle = (row, col, size, cols) => {
    const centerX = cols / 4;
    const direction = col < centerX ? -1 : 1;
    const distance = Math.abs(centerX - col) / centerX;

    return {
      position: "absolute",
      width: `${size}px`,
      height: `${size}px`,
      background: `rgba(255, 105, 180, ${Math.random() * 0.5 + 0.5})`,
      top: `${row * size}px`,
      left: `${centerX * size}px`,
      transform: "translate(-50%, -50%)",
      opacity: 1,
      animation: `horizontal-fly-out 2s forwards`,
      animationDelay: `${distance * 0.2}s`,
      "--direction": direction,
    };
  };

  render() {
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
            .custom-cursor.show { display: block; }
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
              padding: 8px 15px;
              font-size: 0.9rem;
              text-align: center;
              margin-left: 17px;
              border-radius: 12px;
              color: rgb(84, 83, 83) !important;
              background: linear-gradient(135deg, #2c2c54, #40407a);
              border: 1px solid #f5f5f5;
              transition: all 0.4s ease-in-out;
            }
            .futuristik-nav-link.active {
              color: #000 !important;
              background: #fff !important;
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
              0% { opacity: 1; transform: translateX(0) scale(1); }
              100% { opacity: 0; transform: translateX(calc(550px * var(--direction))) scale(0.5); }
            }
          `}
        </style>

        <Row className="justify-content-center">
          <Col lg="12" className="mt-5 mt-lg-0">
            <div className="mb-3">
              {/* <small className="text-uppercase font-weight-bold">Menu</small> */}
            </div>
            <div className="nav-wrapper">
              <Nav
                className="nav-fill flex-md-row"
                id="tabs-icons-text"
                pills
                role="tablist"
              >
                <Row className="w-100">
                  {[1, 2, 3].map((index) => (
                    <Col key={index} lg="4" className="mb-3">
                      <NavItem>
                        <NavLink
                          aria-selected={this.state.plainTabs === index}
                          className={classnames("futuristik-nav-link", {
                            active: this.state.plainTabs === index,
                          })}
                          onClick={(e) =>
                            this.toggleNavs(e, "plainTabs", index)
                          }
                          href="#pablo"
                          role="tab"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            width: "100%", // Pastikan memenuhi lebar container
                          }}
                        >
                          <b
                            style={{
                              fontSize: "8px",
                              textAlign: "center",
                            }}
                          >
                            {index === 1
                              ? "PROFIL"
                              : index === 2
                              ? "LAYANAN"
                              : "TRANSPARANSI"}
                          </b>
                          {this.state.pieces[index]?.map((piece) => (
                            <div
                              key={`${piece.id}-${this.state.animationKeys[index]}`}
                              className="horizontal-fly-out"
                              style={piece.style}
                            ></div>
                          ))}
                        </NavLink>
                      </NavItem>
                    </Col>
                  ))}
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

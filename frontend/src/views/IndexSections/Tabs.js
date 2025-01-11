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
    pieces: {
      1: [],
      2: [],
      3: [],
    },
    numPieces: 150,
    animationKeys: {
      1: Date.now(),
      2: Date.now(),
      3: Date.now(),
    },
  };

  toggleNavs = (e, state, index) => {
    e.preventDefault();

    this.setState({
      [state]: index,
      animationKeys: {
        ...this.state.animationKeys,
        [index]: Date.now(),
      },
      pieces: {
        ...this.state.pieces,
        [index]: this.generatePieces(index),
      },
    });
  };

  generatePieces = (index) => {
    const pieces = [];
    const centerX = 50;
    const centerY = 50;

    for (let i = 0; i < this.state.numPieces; i++) {
      const distanceFromCenter = Math.random();
      const angle = Math.random() * 2 * Math.PI;

      const offsetX = centerX + Math.cos(angle) * distanceFromCenter * 50;
      const offsetY = centerY + Math.sin(angle) * distanceFromCenter * 50;

      pieces.push({
        id: i,
        style: this.structuredPieceStyle(offsetX, offsetY, distanceFromCenter),
      });
    }
    return pieces.sort((a, b) =>
      a.style.animationDelay.localeCompare(b.style.animationDelay)
    );
  };

  structuredPieceStyle = (x, y, distanceFactor) => {
    return {
      position: "absolute",
      width: `${Math.random() * 10 + 5}px`,
      height: `${Math.random() * 10 + 5}px`,
      background: `rgba(255, 105, 180, ${Math.random() * 0.5 + 0.5})`,
      top: `${y}%`,
      left: `${x}%`,
      transform: `translate(-50%, -50%)`,
      opacity: 1,
      animation: `fly-out 1s forwards`,
      animationDelay: `${distanceFactor}s`,
    };
  };

  render() {
    return (
      <>
        <style>
          {`
            .futuristik-nav-link {
              position: relative;
              overflow: hidden;
              display: inline-block;
              width: 100%;
              padding: 15px 25px;
              font-size: 1.2rem;
              text-align: center;
              border-radius: 12px;
              color: #808080 !important;
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
              background: rgba(255, 255, 255, 0.1);
              color: rgb(58, 57, 57) !important;
              border: 2px solid #fffa65;
              box-shadow: 0 0 15px rgba(255, 255, 255, 0.8),
                          0 0 25px rgba(238, 130, 238, 0.7),
                          0 0 35px rgba(255, 215, 0, 0.6),
                          0 0 45px rgba(0, 255, 255, 0.7);
              transition: all 0.5s ease-in-out;
            }

            @keyframes fly-out {
              0% {
                opacity: 1;
                transform: translate(0, 0) scale(1);
              }
              100% {
                opacity: 0;
                transform: translate(calc(100px * (rand(-1, 1))), calc(100px * (rand(-1, 1)))) scale(0.5);
              }
            }
          `}
        </style>

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
                        href="#pablo"
                        role="tab"
                      >
                        <b>PROFIL</b>
                        {this.state.pieces[1]?.map((piece) => (
                          <div
                            key={`${piece.id}-${this.state.animationKeys[1]}`}
                            className="fly-out"
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
                        href="#pablo"
                        role="tab"
                      >
                        <b>LAYANAN</b>
                        {this.state.pieces[2]?.map((piece) => (
                          <div
                            key={`${piece.id}-${this.state.animationKeys[2]}`}
                            className="fly-out"
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
                        href="#pablo"
                        role="tab"
                      >
                        <b>TRANSPARANSI</b>
                        {this.state.pieces[3]?.map((piece) => (
                          <div
                            key={`${piece.id}-${this.state.animationKeys[3]}`}
                            className="fly-out"
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

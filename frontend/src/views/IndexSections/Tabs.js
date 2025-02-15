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
import Modals from "./Modals";
import Modall from "./Modall";
import Modalt from "./Modalt";

class TabsSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plainTabs: 1,
      pieces: { 1: [], 2: [], 3: [] },
      numPieces: 100,
      animationKeys: { 1: Date.now(), 2: Date.now(), 3: Date.now() },
    };
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
      transform: "translate(-50%, -50%) rotate(0deg)",
      opacity: 1,
      animation: `horizontal-fly-out 2s forwards, rotate-piece 1.5s ease-in-out`,
      animationDelay: `${distance * 0.2}s`,
      "--direction": direction,
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
              transition: all 0.3s ease-in-out;
            }
            .futuristik-nav-link::after {
              content: "";
              position: absolute;
              width: 300%;
              height: 300%;
              top: 50%;
              left: 50%;
              background: rgba(255, 105, 180, 0.3);
              transition: transform 0.5s ease-in-out;
              border-radius: 50%;
              transform: translate(-50%, -50%) scale(0);
            }
            .futuristik-nav-link.active::after {
              transform: translate(-50%, -50%) scale(1);
            }
            .tab-content {
              opacity: 0;
              transform: translateY(20px);
              transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
            }
            .tab-content.active {
              opacity: 1;
              transform: translateY(0);
            }
            @keyframes horizontal-fly-out {
              0% { opacity: 1; transform: translateX(0) scale(1); }
              100% { opacity: 0; transform: translateX(calc(550px * var(--direction))) scale(0.5); }
            }
            @keyframes rotate-piece {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
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
                        >
                          <b>
                            {index === 1
                              ? "PROFIL"
                              : index === 2
                              ? "LAYANAN"
                              : "TRANSPARANSI"}
                          </b>
                        </NavLink>
                      </NavItem>
                    </Col>
                  ))}
                </Row>
              </Nav>
            </div>
            <TabContent
              activeTab={`plainTabs${this.state.plainTabs}`}
              className="tab-content active"
            >
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

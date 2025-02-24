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
            .futuristik-nav-link {
              position: relative;
              overflow: hidden;
              display: inline-block;
              width: 90%;
              padding: 12px 20px;
              font-size: 0.85rem;
              text-align: center;
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
            .nav-wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
            }
          `}
        </style>

        <Row className="justify-content-center">
          <Col lg="12" className="mt-5 mt-lg-0">
            <div className="nav-wrapper">
              <Nav className="w-100" pills role="tablist">
                <Row className="w-100 justify-content-center">
                  {[1, 2, 3].map((index) => (
                    <Col
                      key={index}
                      lg="4"
                      className="mb-3 d-flex justify-content-center"
                    >
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
                          {index === 1
                            ? "PROFIL"
                            : index === 2
                            ? "LAYANAN"
                            : "TRANSPARANSI"}
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

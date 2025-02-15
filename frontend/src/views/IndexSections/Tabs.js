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
import "./PixelTransition.css";

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
        style: this.pixelatedPieceStyle(row, col, size, cols),
      };
    });
  };

  pixelatedPieceStyle = (row, col, size, cols) => {
    return {
      position: "absolute",
      width: `${size}px`,
      height: `${size}px`,
      background: `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`,
      top: `${row * size}px`,
      left: `${col * size}px`,
      opacity: 0,
      animation: `pixelated-fade-in 0.5s forwards`,
      animationDelay: `${Math.random() * 0.5}s`,
    };
  };

  render() {
    return (
      <>
        <style>
          {`
            .pixelated-tab {
              position: relative;
              overflow: hidden;
            }
            .pixelated-pieces {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              display: grid;
              grid-template-columns: repeat(10, 1fr);
              grid-template-rows: repeat(10, 1fr);
              pointer-events: none;
            }
            @keyframes pixelated-fade-in {
              0% { opacity: 0; transform: scale(0.8); }
              100% { opacity: 1; transform: scale(1); }
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
                          className={classnames("pixelated-tab", {
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
                <div className="pixelated-pieces">
                  {this.state.pieces[1].map((piece) => (
                    <div key={piece.id} style={piece.style}></div>
                  ))}
                </div>
                <Modals />
              </TabPane>
              <TabPane tabId="plainTabs2">
                <div className="pixelated-pieces">
                  {this.state.pieces[2].map((piece) => (
                    <div key={piece.id} style={piece.style}></div>
                  ))}
                </div>
                <Modall />
              </TabPane>
              <TabPane tabId="plainTabs3">
                <div className="pixelated-pieces">
                  {this.state.pieces[3].map((piece) => (
                    <div key={piece.id} style={piece.style}></div>
                  ))}
                </div>
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

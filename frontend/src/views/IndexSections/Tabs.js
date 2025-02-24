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
    };
  }

  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({ plainTabs: index });
  };

  render() {
    return (
      <>
        <style>
          {`
            .nav-wrapper {
              display: flex;
              justify-content: center;
              width: 100%;
            }

            .futuristik-nav-link {
              width: 100%;
              padding: 8px 12px;
              text-align: center;
              font-size: 0.9rem;
              border-radius: 8px;
              background: linear-gradient(135deg, #2c2c54, #40407a);
              color: white !important;
              border: 1px solid #f5f5f5;
              transition: all 0.3s ease-in-out;
            }

            .futuristik-nav-link.active {
              background: #fff !important;
              color: #000 !important;
              box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
            }

            @media screen and (max-width: 480px) {
              .nav-wrapper .row {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 5px;
              }
              .nav-wrapper .col {
                flex: 0 0 30%;
                max-width: 30%;
              }
            }

            @media screen and (min-width: 481px) {
              .nav-wrapper .row {
                display: flex;
                flex-wrap: nowrap;
                justify-content: center;
              }
              .nav-wrapper .col {
                flex: 1;
                max-width: 200px;
              }
            }
          `}
        </style>

        <Row className="justify-content-center">
          <Col lg="12" className="mt-5 mt-lg-0">
            <div className="nav-wrapper">
              <Nav className="w-100" pills role="tablist">
                <Row className="w-100">
                  {[1, 2, 3].map((index) => (
                    <Col key={index} className="col">
                      <NavItem>
                        <NavLink
                          aria-selected={this.state.plainTabs === index}
                          className={classnames("futuristik-nav-link", {
                            active: this.state.plainTabs === index,
                          })}
                          onClick={(e) => this.toggleNavs(e, index)}
                          href="#"
                          role="tab"
                        >
                          {index === 1
                            ? "PROFIL"
                            : index === 2
                            ? "LAYANAN"
                            : "TRANSPARANSI"}
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

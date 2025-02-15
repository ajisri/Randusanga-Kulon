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

  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({ [state]: index });
  };

  render() {
    if (!this.props.isVisible) return null; // Sembunyikan jika tidak terlihat

    return (
      <Row className="justify-content-center">
        <Col lg="12" className="mt-4">
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
                        onClick={(e) => this.toggleNavs(e, "plainTabs", index)}
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
    );
  }
}

export default TabsSection;

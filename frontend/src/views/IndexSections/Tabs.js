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
    iconTabs: 1,
    plainTabs: 1,
  };

  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index,
    });
  };

  render() {
    // Deteksi jika tampilan adalah mobile
    const isMobile = window.innerWidth <= 768;

    // Gaya dinamis
    const tabStyle = {
      color: "white",
      marginLeft: isMobile ? "35px" : "35px", // Geser ke kanan sedikit di mobile
    };

    return (
      <>
        <Row className="justify-content-center">
          <Col lg="12" className="mt-5 mt-lg-0">
            {/* Menu */}
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
                        className={classnames(
                          "btn btn-outline btn-default text-warning",
                          {
                            active: this.state.plainTabs === 1,
                          }
                        )}
                        onClick={(e) => this.toggleNavs(e, "plainTabs", 1)}
                        href="#pablo"
                        role="tab"
                        style={tabStyle}
                      >
                        <b>Profil</b>
                      </NavLink>
                    </NavItem>
                  </Col>
                  <Col lg="4" className="mb-3">
                    <NavItem>
                      <NavLink
                        aria-selected={this.state.plainTabs === 2}
                        className={classnames(
                          "btn btn-outline btn-default text-warning",
                          {
                            active: this.state.plainTabs === 2,
                          }
                        )}
                        onClick={(e) => this.toggleNavs(e, "plainTabs", 2)}
                        href="#pablo"
                        role="tab"
                        style={tabStyle}
                      >
                        <b>Layanan</b>
                      </NavLink>
                    </NavItem>
                  </Col>
                  <Col lg="4" className="mb-3">
                    <NavItem>
                      <NavLink
                        aria-selected={this.state.plainTabs === 3}
                        className={classnames(
                          "btn btn-outline btn-default text-warning",
                          {
                            active: this.state.plainTabs === 3,
                          }
                        )}
                        onClick={(e) => this.toggleNavs(e, "plainTabs", 3)}
                        href="#pablo"
                        role="tab"
                        style={tabStyle}
                      >
                        <b>Transparansi</b>
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

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
    const isMobile = window.innerWidth <= 768;

    const tabStyle = {
      color: "white",
      marginLeft: isMobile ? "35px" : "35px",
    };

    return (
      <>
        <style>
          {`
            .nav-link {
              position: relative;
              display: inline-block;
              font-family: 'Orbitron', sans-serif;
              font-size: 1.1rem;
              text-transform: uppercase;
              text-decoration: none;
              color: #fffa65;
              border: 2px solid transparent;
              padding: 10px 20px;
              border-radius: 10px;
              background: transparent;
              background-color: transparent;
              overflow: hidden;
              z-index: 1;
              transition: background 0.3s ease, color 0.3s ease;
            }

            @keyframes splitEffect {
              0% {
                transform: scale(1);
                clip-path: inset(0 0 0 0); /* Utuh, tidak terpecah */
                opacity: 1;
                background-color: transparent;
              }
              25% {
                transform: scale(1);
                clip-path: inset(0 25% 0 25%); /* Mulai pecah dari tengah */
                opacity: 0.9;
                background-color: transparent;
              }
              50% {
                transform: scale(1);
                clip-path: inset(0 50% 0 50%); /* Pecah menjadi dua bagian dari tengah */
                opacity: 0.8;
                background-color: transparent;
              }
              75% {
                transform: scale(1);
                clip-path: inset(0 75% 0 75%); /* Terbagi lebih jauh */
                opacity: 0.6;
                background-color: transparent;
              }
              100% {
                transform: scale(1);
                clip-path: inset(0 0 0 0); /* Kembali ke bentuk pecah penuh */
                opacity: 1; /* Hilang sepenuhnya pada akhir animasi */
                background-color: transparent;
              }
            }

             @keyframes neonBorderEffect {
      0% {
        border-top-color: rgba(255, 255, 255, 0.8); /* Putih lembut */
        border-right-color: rgba(144, 238, 144, 0.8); /* Hijau pastel */
        border-bottom-color: rgba(255, 215, 0, 0.8); /* Emas lembut */
        border-left-color: rgba(255, 140, 0, 0.8); /* Oranye terang */
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(144, 238, 144, 0.8), 0 0 40px rgba(255, 215, 0, 0.8), 0 0 50px rgba(255, 140, 0, 0.8), 0 0 60px rgba(238, 130, 238, 0.8);
      }
      25% {
        border-top-color: rgba(144, 238, 144, 0.8); /* Hijau pastel */
        border-right-color: rgba(255, 215, 0, 0.8); /* Emas lembut */
        border-bottom-color: rgba(255, 140, 0, 0.8); /* Oranye terang */
        border-left-color: rgba(238, 130, 238, 0.8); /* Ungu pastel */
        box-shadow: 0 0 20px rgba(144, 238, 144, 0.8), 0 0 30px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 140, 0, 0.8), 0 0 50px rgba(238, 130, 238, 0.8), 0 0 60px rgba(255, 255, 255, 0.8);
      }
      50% {
        border-top-color: rgba(255, 215, 0, 0.8); /* Emas lembut */
        border-right-color: rgba(255, 140, 0, 0.8); /* Oranye terang */
        border-bottom-color: rgba(238, 130, 238, 0.8); /* Ungu pastel */
        border-left-color: rgba(255, 255, 255, 0.8); /* Putih lembut */
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 140, 0, 0.8), 0 0 40px rgba(238, 130, 238, 0.8), 0 0 50px rgba(255, 255, 255, 0.8), 0 0 60px rgba(144, 238, 144, 0.8);
      }
      75% {
        border-top-color: rgba(255, 140, 0, 0.8); /* Oranye terang */
        border-right-color: rgba(238, 130, 238, 0.8); /* Ungu pastel */
        border-bottom-color: rgba(255, 255, 255, 0.8); /* Putih lembut */
        border-left-color: rgba(144, 238, 144, 0.8); /* Hijau pastel */
        box-shadow: 0 0 20px rgba(255, 140, 0, 0.8), 0 0 30px rgba(238, 130, 238, 0.8), 0 0 40px rgba(255, 255, 255, 0.8), 0 0 50px rgba(144, 238, 144, 0.8), 0 0 60px rgba(255, 215, 0, 0.8);
      }
      100% {
        border-top-color: rgba(238, 130, 238, 0.8); /* Ungu pastel */
        border-right-color: rgba(255, 255, 255, 0.8); /* Putih lembut */
        border-bottom-color: rgba(144, 238, 144, 0.8); /* Hijau pastel */
        border-left-color: rgba(255, 215, 0, 0.8); /* Emas lembut */
        box-shadow: 0 0 20px rgba(238, 130, 238, 0.8), 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(144, 238, 144, 0.8), 0 0 50px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 140, 0, 0.8);
      }
    }

     /* Menghindari warna latar belakang biru pada saat fokus */
    .nav-link:focus {
      outline: none; /* Menonaktifkan outline biru default pada fokus */
      background-color: transparent; /* Menjaga transparansi */
    }

    .nav-link.active {
      background-color: transparent; /* Pastikan tetap transparan saat aktif */
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border-radius: 12px; /* Sama dengan tombol */
      border: 2px solid transparent; /* Border tetap transparan */
      animation: neonBorderEffect 3s linear infinite; /* Animasi border */
      pointer-events: none; /* Mencegah interaksi dengan pseudo-element */
      box-shadow: 
        0 0 20px rgba(255, 255, 255, 0.8), /* Putih lembut */
        0 0 30px rgba(144, 238, 144, 0.8), /* Hijau pastel */
        0 0 40px rgba(255, 215, 0, 0.8),  /* Emas lembut */
        0 0 50px rgba(255, 140, 0, 0.8),  /* Oranye terang */
        0 0 60px rgba(238, 130, 238, 0.8); /* Ungu pastel */
    }

    .nav-link:hover {
      color: #000;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid #fffa65;
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.8),
                  0 0 25px rgba(238, 130, 238, 0.7),
                  0 0 35px rgba(255, 215, 0, 0.6),
                  0 0 45px rgba(0, 255, 255, 0.7); /* Cyan neon */
      transition: all 0.5s ease-in-out;
    }

    /* Efek border dengan warna shadow */
    .nav-link.active {
      border: 2px solid transparent;
      box-shadow: 0 0 10px rgba(144, 238, 144, 0.8), /* Shadow Hijau Neon */
                  0 0 20px rgba(255, 215, 0, 0.8),  /* Shadow Emas Neon */
                  0 0 30px rgba(255, 140, 0, 0.8),  /* Shadow Oranye Neon */
                  0 0 40px rgba(238, 130, 238, 0.8), /* Shadow Ungu Neon */
                  0 0 50px rgba(0, 255, 255, 0.8); /* Shadow Cyan Neon */
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
                        className={classnames("nav-link", {
                          active: this.state.plainTabs === 1,
                        })}
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
                        className={classnames("nav-link", {
                          active: this.state.plainTabs === 2,
                        })}
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
                        className={classnames("nav-link", {
                          active: this.state.plainTabs === 3,
                        })}
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

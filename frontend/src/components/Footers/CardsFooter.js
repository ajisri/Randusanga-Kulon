/*!

=========================================================
* Argon Design System React - v1.1.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  Card,
  CardImg,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

class CardsFooter extends React.Component {
  render() {
    return (
      <>
        <footer
          className="footer has-cards"
          style={{ backgroundColor: "#f8f9fa", padding: "2rem 0" }}
        >
          <Container>
            <Row className="row-grid align-items-center my-md">
              <Col lg="6" className="text-center text-lg-left mb-4 mb-lg-0">
                <h3 className="text-primary font-weight-light mb-2">
                  Terima kasih atas kunjungannya!
                </h3>
                <h4 className="mb-0 font-weight-light">
                  Ayo kunjungi platform media sosial kami.
                </h4>
              </Col>
              <Col lg="6" className="text-center text-lg-right btn-wrapper">
                {/* TikTok Button */}
                <Button
                  className="btn-icon-only rounded-circle"
                  color="dark"
                  href="http://www.tiktok.com/@pemdesrangkul"
                  id="tooltip475038074"
                  target="_blank"
                  style={{ margin: "0 0.5rem", fontSize: "1.5rem" }}
                >
                  <span className="btn-inner--icon">
                    <i className="fab fa-tiktok" />
                  </span>
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip475038074">
                  Follow kami di TikTok
                </UncontrolledTooltip>

                {/* Facebook Button */}
                <Button
                  className="btn-icon-only rounded-circle"
                  color="primary"
                  href="https://www.facebook.com/profile.php?id=100087590198004&mibextid=rS40aB7S9Ucbxw6v"
                  id="tooltip837440414"
                  target="_blank"
                  style={{ margin: "0 0.5rem", fontSize: "1.5rem" }}
                >
                  <span className="btn-inner--icon">
                    <i className="fab fa-facebook-square" />
                  </span>
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip837440414">
                  Like kami di Facebook
                </UncontrolledTooltip>

                {/* YouTube Button */}
                <Button
                  className="btn-icon-only rounded-circle"
                  color="danger"
                  href="https://www.youtube.com/@pemerintahdesarandusangakulon"
                  id="tooltip829810202"
                  target="_blank"
                  style={{ margin: "0 0.5rem", fontSize: "1.5rem" }}
                >
                  <span className="btn-inner--icon">
                    <i className="fab fa-youtube" />
                  </span>
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip829810202">
                  Subscribe di YouTube
                </UncontrolledTooltip>
              </Col>
            </Row>
            <hr style={{ borderColor: "#dee2e6" }} />
            <Row className="text-center mb-3">
              <Col>
                <p className="font-weight-light text-muted mb-0">
                  Alamat: Jalan Kebandengan No.01 Randusanga Kulon, Kode Pos
                  52219
                  <br />
                  Kontak: 085712790338
                  <br />
                  Email:{" "}
                  <a href="mailto:randusangakulon99@gmail.com">
                    randusangakulon99@gmail.com
                  </a>
                  <br />
                  Facebook:{" "}
                  <a
                    href="https://www.facebook.com/profile.php?id=100087590198004&mibextid=rS40aB7S9Ucbxw6v"
                    target="_blank"
                  >
                    Pemerintah Desa Randusanga Kulon
                  </a>
                  <br />
                  TikTok:{" "}
                  <a
                    href="http://www.tiktok.com/@pemdesrangkul"
                    target="_blank"
                  >
                    @pemdesrangkul
                  </a>
                  <br />
                  YouTube:{" "}
                  <a
                    href="https://www.youtube.com/@pemerintahdesarandusangakulon"
                    target="_blank"
                  >
                    Pemerintah Desa Randusanga Kulon
                  </a>
                </p>
              </Col>
            </Row>
            <Row className="text-center">
              <Col>
                <p className="font-weight-light text-muted mb-0">
                  &copy; {new Date().getFullYear()} Pemerintah Desa Randusanga
                  Kulon. All rights reserved.
                </p>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default CardsFooter;

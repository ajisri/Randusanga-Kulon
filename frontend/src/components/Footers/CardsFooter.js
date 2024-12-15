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
          style={{
            backgroundColor: "#343a40",
            color: "#f8f9fa",
            padding: "2rem 0",
          }}
        >
          <Container>
            <Row className="row-grid align-items-center my-md">
              <Col lg="6" className="text-center text-lg-left mb-4 mb-lg-0">
                <h4 className="mb-0 font-weight-light">
                  <span style={{ color: "#ffc107", fontWeight: "bold" }}>
                    Ayo kunjungi media sosial kami.
                  </span>
                </h4>
              </Col>
              <Col lg="6" className="text-center text-lg-right btn-wrapper">
                {/* TikTok Button */}
                <Button
                  className="btn-icon-only rounded-circle"
                  color="light"
                  href="http://www.tiktok.com/@pemdesrangkul"
                  id="tooltip475038074"
                  target="_blank"
                  style={{
                    margin: "0 0.5rem",
                    fontSize: "1.5rem",
                    backgroundColor: "#ff0050",
                    border: "none",
                  }}
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
                  color="light"
                  href="https://www.facebook.com/profile.php?id=100087590198004&mibextid=rS40aB7S9Ucbxw6v"
                  id="tooltip837440414"
                  target="_blank"
                  style={{
                    margin: "0 0.5rem",
                    fontSize: "1.5rem",
                    backgroundColor: "#3b5998",
                    border: "none",
                  }}
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
                  color="light"
                  href="https://www.youtube.com/@pemerintahdesarandusangakulon"
                  id="tooltip829810202"
                  target="_blank"
                  style={{
                    margin: "0 0.5rem",
                    fontSize: "1.5rem",
                    backgroundColor: "#ff0000",
                    border: "none",
                  }}
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
            <hr style={{ borderColor: "#495057" }} />
            <Row className="text-center mb-4">
              <Col>
                <p className="font-weight-light mb-2">
                  <strong>Alamat:</strong> Jalan Kebandengan No.01 Randusanga
                  Kulon, Kode Pos 52219
                  <br />
                  <strong>Kontak:</strong> 085712790338
                  <br />
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:randusangakulon99@gmail.com"
                    style={{ color: "#f8f9fa", textDecoration: "underline" }}
                  >
                    randusangakulon99@gmail.com
                  </a>
                </p>
                <p className="font-weight-light">
                  <strong>Sosial Media:</strong>
                  <br />
                  <a
                    href="https://www.facebook.com/profile.php?id=100087590198004&mibextid=rS40aB7S9Ucbxw6v"
                    target="_blank"
                    style={{
                      color: "#3b5998",
                      textDecoration: "none",
                      marginRight: "1rem",
                    }}
                  >
                    Facebook
                  </a>
                  <a
                    href="http://www.tiktok.com/@pemdesrangkul"
                    target="_blank"
                    style={{
                      color: "#ff0050",
                      textDecoration: "none",
                      marginRight: "1rem",
                    }}
                  >
                    TikTok
                  </a>
                  <a
                    href="https://www.youtube.com/@pemerintahdesarandusangakulon"
                    target="_blank"
                    style={{ color: "#ff0000", textDecoration: "none" }}
                  >
                    YouTube
                  </a>
                </p>
              </Col>
            </Row>
            <Row className="text-center">
              <Col>
                <p className="font-weight-light text-muted mb-0">
                  &copy; {new Date().getFullYear()}{" "}
                  <strong>Pemerintah Desa Randusanga Kulon</strong>. All rights
                  reserved.
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

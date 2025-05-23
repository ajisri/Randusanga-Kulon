import React from "react";

// reactstrap components
import { Container } from "reactstrap";

// core components
// import DemoNavbar from "components/Navbars/DemoNavbar.js";
import CardsFooter from "components/Footers/CardsFooter.js";

// index page sections
import Hero from "./IndexSections/Hero.js";
// import Buttons from "./IndexSections/Buttons.js";
// import Inputs from "./IndexSections/Inputs.js";
// import CustomControls from "./IndexSections/CustomControls.js";
// import Menus from "./IndexSections/Menus.js";
// import Navbars from "./IndexSections/Navbars.js";
// import Tabs from "./IndexSections/Tabs.js";
// import Progress from "./IndexSections/Progress.js";
// import Pagination from "./IndexSections/Pagination.js";
// import Pills from "./IndexSections/Pills.js";
// import Labels from "./IndexSections/Labels.js";
// import Alerts from "./IndexSections/Alerts.js";
// import Typography from "./IndexSections/Typography.js";
// import Modals from "./IndexSections/Modals.js";
// import Datepicker from "./IndexSections/Datepicker.js";
// import TooltipPopover from "./IndexSections/TooltipPopover.js";
// import Carousel from "./IndexSections/Carousel.js";
// import Icons from "./IndexSections/Icons.js";
// import Login from "./IndexSections/Login.js";
// import Download from "./IndexSections/Download.js";
import Landing from "./IndexSections/Landing.js";

class Index extends React.Component {
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (this.mainRef) {
      this.mainRef.scrollTop = 0;
    }
  }

  render() {
    return (
      <>
        {/* <DemoNavbar /> */}
        <main ref={(ref) => (this.mainRef = ref)}>
          {" "}
          {/* Menggunakan fungsi callback */}
          <Hero />
          <Landing />
          {/* <Inputs /> */}
          <section className="section">
            <Container>
              {/* <CustomControls /> */}
              {/* <Menus /> */}
            </Container>
          </section>
          {/* <Navbars /> */}
          {/* <section className="section section-components"> */}
          {/* <Container>
                <Tabs />
                <Row className="row-grid justify-content-between align-items-center mt-lg"> */}
          {/* <Progress /> */}
          {/* <Pagination /> */}
          {/* </Row>
              <Row className="row-grid justify-content-between"> */}
          {/* <Pills /> */}
          {/* <Labels /> */}
          {/* </Row> */}
          {/* <Alerts /> */}
          {/* <Typography /> */}
          {/* <Modals /> */}
          {/* <Datepicker /> */}
          {/* <TooltipPopover /> */}
          {/* </Container> */}
          {/* </section> */}
          {/* <Carousel />
          <Icons /> */}
          {/* <Login /> */}
          {/* <Download /> */}
        </main>
        <CardsFooter />
      </>
    );
  }
}

export default Index;

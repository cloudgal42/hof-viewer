import {Nav} from "react-bootstrap";

import "../../../css/components/SectionNav.css";

export const SectionNav = () => {
  return (
    <div className="section-nav mb-2 md-lg-0">
      <section className="col-auto text-nowrap">
        <h2 className="fs-3 mb-3">Settings</h2>
        <Nav variant="pills" defaultActiveKey="/home" className="flex-lg-column">
          <Nav.Item>
            <Nav.Link className="link-body-emphasis" href="#appearance">Appearance</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="link-body-emphasis" href="#groupedCities">Grouped Cities</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="link-body-emphasis" href="#translation">Translation</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="link-body-emphasis" href="#algoSettings">
              Random Algorithm
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="link-body-emphasis" href="#about">
              About
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </section>
    </div>
  )
}
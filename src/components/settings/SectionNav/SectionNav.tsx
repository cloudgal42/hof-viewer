import "../../../css/components/SectionNav.scss";
import ScrollSpy from "react-scrollspy-navigation";
import {BackButton} from "../../misc/BackButton/BackButton.tsx";
import {Brush, Buildings, Dice3, InfoCircle, Translate} from "react-bootstrap-icons";

export const SectionNav = () => {
  return (
    <div className="section-nav mb-2 md-lg-0">
      <section className="col-auto text-nowrap">
        <div className="mb-2 mb-lg-3 d-flex align-items-center">
          <BackButton />
          <h2 className="fs-3 mb-0">Settings</h2>
        </div>
        {/*<ScrollSpy activeClass="active" threshold={1} onClickEach={(e, next, container) => {*/}
        {/*  if (e.currentTarget) {*/}
        {/*    const element = document.querySelector(`${e.currentTarget.getAttribute("href")}`);*/}
        {/*    if (element) {*/}
        {/*      element.scrollIntoView({behavior: "smooth"});*/}
        {/*    }*/}
        {/*  }*/}
        {/*}}>*/}
          <nav>
            <ul className="nav nav-pills flex-lg-column">
              <li className="nav-item">
                <a className="nav-link link-body-emphasis" href="#appearance">
                  <Brush className="me-2" />
                  Appearance
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link link-body-emphasis" href="#groupedCities">
                  <Buildings className="me-2" />
                  Grouped Cities
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link link-body-emphasis" href="#translation">
                  <Translate className="me-2" />
                  Translation
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link link-body-emphasis" href="#algoSettings">
                  <Dice3 className="me-2" />
                  Random Algorithm
                </a>
              </li>
              <li>
                <a className="nav-link link-body-emphasis" href="#about">
                  <InfoCircle className="me-2" />
                  About
                </a>
              </li>
            </ul>
          </nav>
        {/*</ScrollSpy>*/}
      </section>
    </div>
  )
}
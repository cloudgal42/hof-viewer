import "../../../css/components/SectionNav.scss";
import ScrollSpy from "react-scrollspy-navigation";

export const SectionNav = () => {
  return (
    <div className="section-nav mb-2 md-lg-0">
      <section className="col-auto text-nowrap">
        <h2 className="fs-3 mb-lg-3">Settings</h2>
        <ScrollSpy activeClass="active" threshold={1} onClickEach={(e, next, container) => {
          if (e.currentTarget) {
            const element = document.querySelector(`${e.currentTarget.getAttribute("href")}`);
            if (element) {
              element.scrollIntoView({behavior: "smooth"});
            }
          }
        }}>
          <nav>
            <ul className="nav nav-pills flex-lg-column">
              <li className="nav-item">
                <a className="nav-link link-body-emphasis" href="#appearance">
                  Appearance
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link link-body-emphasis" href="#groupedCities">
                  Grouped Cities
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link link-body-emphasis" href="#translation">
                  Translation
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link link-body-emphasis" href="#algoSettings">
                  Random Algorithm
                </a>
              </li>
              <li>
                <a className="nav-link link-body-emphasis" href="#about">
                  About
                </a>
              </li>
            </ul>
          </nav>
        </ScrollSpy>
      </section>
    </div>
  )
}
import {BoxArrowUpRight, Dice3, Gear, PersonCircle, Search} from "react-bootstrap-icons";
import {CloseButton, Offcanvas} from "react-bootstrap";
import {NavLink} from "react-router";

interface SidebarProps {
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
}

export const Sidebar = ({isOpened, setIsOpened}: SidebarProps) => {
  return (
    <aside className="d-none d-lg-block flex-shrink-0">
      <Offcanvas
        show={isOpened}
        onHide={() => setIsOpened(false)}
        responsive="lg"
        className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary"
      >
        <div className="d-flex justify-content-between align-items-center mb-0">
          <a
            href="/"
            className="text-decoration-none"
          >
          <span className="fs-4">
            HoF
          </span>
          </a>
          <CloseButton
            className="d-lg-none"
            onClick={() => setIsOpened(false)}
          />
        </div>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <NavLink
              to="/"
              className="nav-link link-body-emphasis d-flex align-items-center"
              onClick={() => setIsOpened(false)}
            >
              <Search height="18" width="18" className="me-2"/>
              Browse by Creator ID
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/random"
              className="nav-link link-body-emphasis d-flex align-items-center"
              onClick={() => setIsOpened(false)}
            >
            <Dice3 height="18" width="18" className="me-2" />
            Random
          </NavLink></li>
          <li className="nav-item">
            <NavLink
              to="/creators"
              className="nav-link link-body-emphasis d-flex align-items-center"
              onClick={() => setIsOpened(false)}
            >
              <PersonCircle height="18" width="18" className="me-2"/>
              Creators
            </NavLink>
          </li>
          <hr/>
          <li className="nav-item">
            <NavLink
              to="/settings"
              className="nav-link link-body-emphasis d-flex align-items-center"
              onClick={() => setIsOpened(false)}
            >
              <Gear height="18" width="18" className="me-2"/>
              Settings
            </NavLink>
          </li>
        </ul>
        <hr/>
        <ul className="list-unstyled text-body-secondary mb-0">
          <li>Hall of Fame Viewer v1.x.x</li>
          <li>
            <a
              href="https://github.com/cloudgal42/hof-viewer/releases"
              target="_blank"
              className="d-flex align-items-center gap-2"
            >
              Changelog
              <BoxArrowUpRight />
            </a>
          </li>
        </ul>
      </Offcanvas>
    </aside>
  )
}
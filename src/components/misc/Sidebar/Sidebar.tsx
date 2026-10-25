import {
  BoxArrowUpRight, CircleHalf,
  Dice3,
  Gear, InfoCircle, Journal, Moon,
  PersonCircle,
  Search, Sun,
} from "react-bootstrap-icons";
import {CloseButton, DropdownButton, DropdownItem, Offcanvas} from "react-bootstrap";
import { NavLink } from "react-router";
import {ThemeDropdownBtn} from "../ThemeDropdownBtn/ThemeDropdownBtn.tsx";
import {CONFIG} from "../../../config/Config.ts";

interface SidebarProps {
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
}

export const Sidebar = ({ isOpened, setIsOpened }: SidebarProps) => {
  return (
    <aside className="d-none d-lg-block flex-shrink-0 z-2">
      <Offcanvas
        show={isOpened}
        onHide={() => setIsOpened(false)}
        responsive="lg"
        className="sidebar d-flex flex-column flex-shrink-0 p-3 border-end bg-body"
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
              <Search height="18" width="18" className="me-2" />
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
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/creators"
              className="nav-link link-body-emphasis d-flex align-items-center"
              onClick={() => setIsOpened(false)}
            >
              <PersonCircle height="18" width="18" className="me-2" />
              Creators
            </NavLink>
          </li>
          <hr />
          <li className="nav-item">
            <NavLink
              to="/settings"
              className="nav-link link-body-emphasis d-flex align-items-center"
              onClick={() => setIsOpened(false)}
            >
              <Gear height="18" width="18" className="me-2" />
              Settings
            </NavLink>
          </li>
          <hr />
          <li className="nav-item">
            <NavLink
              to="/about"
              className="nav-link link-body-emphasis d-flex align-items-center"
            >
              <InfoCircle className="me-2" />
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <a
              href="https://github.com/cloudgal42/hof-viewer/releases"
              target="_blank"
              className="nav-link link-body-emphasis d-flex align-items-center justify-content-between"
            >
              <span className="d-flex align-items-center">
                <Journal className="me-2" />
                Changelog
              </span>
              <BoxArrowUpRight />
            </a>
          </li>
        </ul>
        <hr />
        <div className="d-flex align-items-center justify-content-between">
          <span className="text-body-secondary">{CONFIG.appVersion}</span>
          <ThemeDropdownBtn size="sm" drop="up" align={{sm: "start"}} />
        </div>
      </Offcanvas>
    </aside>
  );
};

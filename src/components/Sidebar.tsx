import {PersonCircle, Search} from "react-bootstrap-icons";
import {CloseButton, Offcanvas} from "react-bootstrap";
import {NavLink} from "react-router";

export interface SidebarProps {
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
}

export const Sidebar = ({isOpened, setIsOpened}: SidebarProps) => {
  return (
    <Offcanvas
      show={isOpened}
      onHide={() => setIsOpened(false)}
      responsive="lg"
      className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary"
    >
      <div className="d-lg-none d-flex justify-content-between align-items-center mb-0">
        <a
          href="/"
          className="text-decoration-none"
        >
          <span className="fs-5">
            HoF
          </span>
        </a>
        <CloseButton onClick={() => setIsOpened(false)} />
      </div>
      <hr className="d-lg-none" />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/"
            className="nav-link d-flex align-items-center"
            onClick={() => setIsOpened(false)}
          >
          <Search height="18" width="18" className="me-2" />
          Browse by Creator ID
          </NavLink>
        </li>
        {/*<li><a href="#" className="nav-link link-body-emphasis d-flex align-items-center">*/}
        {/*  <PencilSquare height="18" width="18" className="me-2" />*/}
        {/*  Manage Screenshots*/}
        {/*</a></li>*/}
        <li className="nav-item">
          <NavLink
            to="/creators"
            className="nav-link d-flex align-items-center"
            onClick={() => setIsOpened(false)}
          >
            <PersonCircle height="18" width="18" className="me-2" />
            Creators
          </NavLink>
        </li>
      </ul>
      <hr/>

    </Offcanvas>
  )
}
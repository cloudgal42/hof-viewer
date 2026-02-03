import {Moon, PersonCircle, Search} from "react-bootstrap-icons";
import {CloseButton, Offcanvas} from "react-bootstrap";
import {NavLink} from "react-router";
import Form from "react-bootstrap/Form";

interface SidebarProps {
  isOpened: boolean;
  isDarkMode: boolean;
  setIsOpened: (isOpened: boolean) => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
}

export const Sidebar = ({isOpened, isDarkMode, setIsOpened, setIsDarkMode}: SidebarProps) => {
  return (
    <Offcanvas
      show={isOpened}
      onHide={() => setIsOpened(false)}
      responsive="lg"
      className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary"
    >
      <div className="d-lg-none d-flex justify-content-between align-items-center mb-0">
        <a
          href="/public"
          className="text-decoration-none"
        >
          <span className="fs-5">
            HoF
          </span>
        </a>
        <CloseButton onClick={() => setIsOpened(false)}/>
      </div>
      <hr className="d-lg-none"/>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/"
            className="nav-link d-flex align-items-center"
            onClick={() => setIsOpened(false)}
          >
            <Search height="18" width="18" className="me-2"/>
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
            <PersonCircle height="18" width="18" className="me-2"/>
            Creators
          </NavLink>
        </li>
      </ul>
      <hr/>
      <div className="d-flex justify-content-between">
        <label htmlFor="darkModeToggle" className="d-flex gap-2 align-items-center">
          <Moon />
          Dark Mode
        </label>
        <Form.Check
          type="switch"
          id="darkModeToggle"
          onChange={(e) => setIsDarkMode(e.currentTarget.checked)}
          checked={isDarkMode}
        >
        </Form.Check>
      </div>

    </Offcanvas>
  )
}
import {PencilSquare, PersonCircle, Search} from "react-bootstrap-icons";
import {CloseButton, Offcanvas} from "react-bootstrap";

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
      className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary"
      style={{height: "100vh", position: "sticky", top: "0",}}
    >
      <div className="d-lg-none d-flex justify-content-between align-items-center mb-3 mb-md-0">
        <a
          href="/"
          className="text-decoration-none">
          <span className="fs-5">HoF</span>
        </a>
        <CloseButton onClick={() => setIsOpened(false)} />
      </div>
      <hr className="d-lg-none" />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item"><a href="#" className="nav-link active d-flex align-items-center" aria-current="page">
          <Search height="18" width="18" className="me-2" />
          Browse by Creator ID
        </a></li>
        <li><a href="#" className="nav-link link-body-emphasis d-flex align-items-center">
          <PencilSquare height="18" width="18" className="me-2" />
          Manage Screenshots
        </a></li>
        <li><a href="#" className="nav-link link-body-emphasis d-flex align-items-center">
          <PersonCircle height="18" width="18" className="me-2" />
          Your Profile
        </a></li>
      </ul>
      <hr/>

    </Offcanvas>
  )
}
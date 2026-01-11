import {PencilSquare, PersonCircle, Search} from "react-bootstrap-icons";

export const Sidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary" style={{height: "100vh", position: "sticky", top: "0",}}>
      <a href="/"
         className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <span className="fs-4">Sidebar</span> </a>
      <hr/>
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

    </div>
  )
}
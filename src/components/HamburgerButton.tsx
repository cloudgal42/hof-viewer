import type {SidebarProps} from "./Sidebar.tsx";
import {Button} from "react-bootstrap";
import {List} from "react-bootstrap-icons";

export const HamburgerButton = ({isOpened, setIsOpened}: SidebarProps) => {
  return (
    <Button
      onClick={() => setIsOpened(!isOpened)}
      variant="outline"
      className="d-block d-lg-none"
    >
      <List width="24" height="24" />
    </Button>
  )
}
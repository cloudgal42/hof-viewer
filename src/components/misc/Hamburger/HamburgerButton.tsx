import {Button} from "react-bootstrap";
import {List} from "react-bootstrap-icons";

interface HamburgerButtonProps {
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
}

export const HamburgerButton = ({isOpened, setIsOpened}: HamburgerButtonProps) => {
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
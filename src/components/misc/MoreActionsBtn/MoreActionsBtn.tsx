import {type ForwardedRef, forwardRef, type MouseEventHandler} from "react";
import {Button} from "react-bootstrap";
import {ThreeDotsVertical} from "react-bootstrap-icons";

export const MoreActionsBtn = forwardRef((
  {onClick}: {onClick: MouseEventHandler}, ref: ForwardedRef<HTMLButtonElement>
) => (
  <Button
    variant="outline"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <span className="visually-hidden">More actions...</span>
    <ThreeDotsVertical />
  </Button>
));
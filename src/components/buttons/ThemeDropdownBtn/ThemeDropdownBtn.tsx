import {Check, Moon, Sun} from "react-bootstrap-icons";
import {DropdownButton, DropdownItem} from "react-bootstrap";
import type {AlignType} from "react-bootstrap/types";
import type {DropDirection} from "react-bootstrap/DropdownContext";
import {useTheme} from "../../../hooks/useTheme.ts";

export const ThemeDropdownBtn = (
  {size, align, drop} : {size?: "sm" | "lg" | undefined, align?: AlignType, drop?: DropDirection}
) => {
  // TODO: Put this behind a provider instead.
  const context = useTheme();
  
  return (
    <DropdownButton variant="link" drop={drop} align={align} size={size} title={
      context.theme === "dark" ? <Moon size={16} /> : <Sun size={16} />
    }>
      <DropdownItem
        className="d-flex align-items-center justify-content-between"
        active={context.theme === "light"}
        onClick={() => context?.setIsDarkMode(false)}
      >
        <span className="d-flex align-items-center gap-2">
          <Sun /> Light
        </span>
        {context.theme === "light" && <Check />}
      </DropdownItem>
      <DropdownItem
        className="d-flex align-items-center justify-content-between"
        active={context.theme === "dark"}
        onClick={() => context?.setIsDarkMode(true)}
      >
        <span className="d-flex align-items-center gap-2">
          <Moon /> Dark
        </span>
        {context.theme === "dark" && <Check />}
      </DropdownItem>
      {/*<DropdownItem className="d-flex align-items-center gap-2" active={context.theme === "light"}>*/}
      {/*  <CircleHalf /> System*/}
      {/*</DropdownItem>*/}
    </DropdownButton>
  )
}
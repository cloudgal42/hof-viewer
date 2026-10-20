import {Check, Moon, Sun} from "react-bootstrap-icons";
import {DropdownButton, DropdownItem} from "react-bootstrap";
import {useContext} from "react";
import {ThemeContext} from "../../../context/ThemeContext.ts";
import type {AlignType} from "react-bootstrap/types";

export const ThemeDropdownBtn = (
  {size, align} : {size?: "sm" | "lg" | undefined, align?: AlignType}
) => {
  // TODO: Put this behind a provider instead.
  const context = useContext(ThemeContext);
  
  if (!context) {
    return null;
  }
  
  return (
    <DropdownButton variant="link" align={align} size={size} title={
      <Moon />
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
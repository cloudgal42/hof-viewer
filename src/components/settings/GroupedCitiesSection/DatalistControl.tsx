import {
  Children,
  cloneElement,
  type CSSProperties,
  type Dispatch,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
  useRef,
  useState,
} from "react";
import {
  Button,
  Dropdown,
  type DropdownItemProps,
  Form,
} from "react-bootstrap";
import { type MouseEvent } from "react";
import Fuse from "fuse.js";
import {ChevronDown, Lightbulb} from "react-bootstrap-icons";

interface DatalistControlProps {
  defaultValue?: string;
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  optionsList: string[];
  onValueSubmit: (value: string) => void;
  newValueHint?: string;
  tipHint?: string;
}

interface DatalistToggleProps extends DatalistControlProps {
  onClick: (e: MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  children: ReactNode;
  currValue: string | undefined;
  setCurrValue: (value: string) => void;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const CustomToggle = forwardRef(({
  id,
  name,
  label,
  placeholder,
  onClick,
  children,
  currValue,
  setCurrValue,
  setIsMenuOpen,
  onValueSubmit,
}: DatalistToggleProps, ref: ForwardedRef<HTMLInputElement>) => {
  const controlRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Form.Control
        id={id}
        ref={(thisRef) => {
          controlRef.current = thisRef;
          if (ref && "current" in ref) {
            ref.current = thisRef;
          }
        }}
        name={name}
        aria-label={label}
        placeholder={placeholder}
        autoComplete="off"
        className="pe-5"
        value={currValue}
        onClick={(e) => {
          e.preventDefault();
          setIsMenuOpen(true);
          onClick(e);
        }}
        onChange={(e) => {
          setCurrValue(e.currentTarget.value);
          setIsMenuOpen(true);
        }}
        onKeyUp={(e) => {
          if (e.code === "Enter") onValueSubmit(e.currentTarget.value);
        }}
      >
        {children}
      </Form.Control>
      <button
        type="button"
        onClick={() =>
          setIsMenuOpen((curr) => {
            if (controlRef.current && !curr) controlRef.current.focus();
            return !curr;
          })}
        className="position-absolute bg-transparent border-0"
        style={{ height: "38px", width: "38px", top: "0px", left: "calc(100% - 38px)" }}
      >
        <span className="visually-hidden">Manually trigger dropdown</span>
        <ChevronDown size="16" />
      </button>
    </>
  );
});

const CustomMenu = forwardRef(({
  children: menuChildren,
  style,
  className,
  currValue,
  tipHint,
  newValueHint,
}: {
  children: ReactElement<DropdownItemProps>;
  style: CSSProperties;
  className: string;
  currValue: string | undefined;
  setIsMenuOpen: (visible: boolean) => void;
  tipHint?: string;
  newValueHint?: string;
}, ref: ForwardedRef<HTMLDivElement>) => {
  const childrenAsArray = Children.toArray(menuChildren);
  const valueExists = childrenAsArray.some((child) =>
    (typeof child === "object" && "props" in child) &&
    (typeof child.props === "object" && child.props &&
      "eventKey" in child.props) &&
    child.props?.eventKey === currValue
  );

  const fuse = new Fuse(childrenAsArray, {
    threshold: 0.4,
    includeScore: true,
    keys: ["props.eventKey"],
  });

  const searchedItems = currValue ? fuse.search(currValue) : childrenAsArray
    .map((child) => {
      return { item: child, score: 0 };
    });

  return (
    <div
      ref={ref}
      style={style}
      className={className}
    >
      <ul className="list-unstyled mb-0">
        {searchedItems.length > 0
          ? (
            <>
              {searchedItems.map((entry, i) => {
                return cloneElement(
                  entry.item as ReactElement<DropdownItemProps>,
                  {
                    className: (
                        i === 0 &&
                          entry.score &&
                          entry.score <= 0.001 ||
                        searchedItems.length === 1
                      )
                      ? "dropdown-item-hover"
                      : "",
                  },
                );
              })}
            </>
          )
          : !currValue && (
            <Dropdown.Header className="fs-6 text-body py-1">
              No preset available. Type a creator name or ID to get started
            </Dropdown.Header>
          )}
        {!valueExists && currValue && newValueHint
          ? (
            <Dropdown.Item
              className={searchedItems.length === 0
                ? "dropdown-item-hover"
                : "" + "text-truncate"}
              eventKey="createNew"
            >
              {newValueHint} "{currValue}"...
            </Dropdown.Item>
          )
          : tipHint && (
            <Dropdown.Header className="fs-6 text-body-secondary py-1 text-truncate">
              <Lightbulb /> {tipHint}
            </Dropdown.Header>
          )}
      </ul>
    </div>
  );
});

export const DatalistControl = (props: DatalistControlProps) => {
  const [currValue, setCurrValue] = useState<string | undefined>(
    props.defaultValue,
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleSetValue(value: string) {
    setCurrValue(value);
    props.onValueSubmit(value);
    setIsMenuOpen(false);
  }

  return (
    <Dropdown
      className="w-100"
      align={{ sm: "start" }}
      show={isMenuOpen}
      onSelect={(eventKey) => {
        console.log(eventKey);
        if (eventKey && eventKey !== "createNew") {
          handleSetValue(eventKey);
        } else if (eventKey === "createNew" && currValue) {
          handleSetValue(currValue);
        }
      }}
      onBlur={(e) => {
        // console.log(e.currentTarget);
        // console.log(e.relatedTarget);

        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsMenuOpen(false);
        }
      }}
    >
      <Dropdown.Toggle
        as={CustomToggle}
        currValue={currValue}
        setCurrValue={setCurrValue}
        setIsMenuOpen={setIsMenuOpen}
        {...props}
      />
      <Dropdown.Menu
        className="w-100"
        as={CustomMenu}
        currValue={currValue}
        setIsMenuOpen={setIsMenuOpen}
        tipHint={props.tipHint}
        newValueHint={props.newValueHint}
      >
        {props.optionsList.map((option) => (
          <Dropdown.Item
            key={option}
            eventKey={option}
            active={option === props.defaultValue}
          >
            {option}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

import {
  type Dispatch,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  type SetStateAction,
  useRef,
  useState,
} from "react";
import {
  Dropdown,
  Form,
} from "react-bootstrap";
import { type MouseEvent } from "react";
import Fuse from "fuse.js";
import { ChevronDown, Lightbulb } from "react-bootstrap-icons";

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
        style={{
          height: "38px",
          width: "38px",
          top: "0px",
          left: "calc(100% - 38px)",
        }}
      >
        <span className="visually-hidden">Manually trigger dropdown</span>
        <ChevronDown size="16" />
      </button>
    </>
  );
});

export const DatalistControl = (props: DatalistControlProps) => {
  const [currValue, setCurrValue] = useState<string | undefined>(
    props.defaultValue,
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const valueExists = props.optionsList.some((child) => child === currValue);

  function handleSetValue(value: string) {
    setCurrValue(value);
    props.onValueSubmit(value);
    setIsMenuOpen(false);
  }

  const fuse = new Fuse(props.optionsList, {
    threshold: 0.4,
    includeScore: true,
  });

  const searchedItems = currValue ? fuse.search(currValue) : props.optionsList
    .map((child) => {
      return { item: child, score: 0 };
    });

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
      <Dropdown.Menu className="w-100">
        {searchedItems.map((option, i) => (
          <Dropdown.Item
            key={option.item}
            eventKey={option.item}
            active={option.item === props.defaultValue}
            className={(i === 0 &&
                  option.score &&
                  option.score <= 0.001 ||
                searchedItems.length === 1)
              ? "dropdown-item-hover"
              : ""}
          >
            {option.item}
          </Dropdown.Item>
        ))}
        {!valueExists && currValue && props.newValueHint
          ? (
            <Dropdown.Item
              className={searchedItems.length === 0
                ? "dropdown-item-hover"
                : "" + "text-wrap"}
              eventKey="createNew"
            >
              {props.newValueHint} "{currValue}"...
            </Dropdown.Item>
          )
          : props.tipHint && (
            <Dropdown.Header className="fs-6 text-body-secondary py-1 text-wrap">
              <Lightbulb /> {props.tipHint}
            </Dropdown.Header>
          )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

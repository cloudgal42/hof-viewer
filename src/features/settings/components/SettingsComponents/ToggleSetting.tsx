import Form from "react-bootstrap/Form";
import type {ChangeEventHandler} from "react";

export const ToggleSetting = ({
  label,
  name,
  id,
  helpBlock,
  onChange,
  defaultValue,
  checked,
  disabled,
}: {
  label: string;
  id: string;
  name: string;
  helpBlock?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  defaultValue?: string;
  checked?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div className={`mb-3 ${disabled ? "opacity-50" : ""}`}>
      <div className="d-flex justify-content-between">
        <label
          htmlFor={id}
          className="fw-semibold d-flex gap-2 align-items-center"
        >
          {label}
        </label>
        <Form.Check
          type="switch"
          name={name}
          id={id}
          onChange={onChange}
          defaultValue={defaultValue}
          checked={checked}
          disabled={disabled}
        >
        </Form.Check>
      </div>
      {helpBlock && (
        <Form.Text
          id={id + "HelpBlock"}
          className="d-inline-block mt-0 lh-2"
          style={{ width: "67%" }}
        >
          {helpBlock}
        </Form.Text>
      )}
    </div>
  );
};

import Form from "react-bootstrap/Form";
import type {ChangeEventHandler, ReactNode} from "react";

export const DropdownSetting = ({
  label,
  name,
  id,
  helpBlock,
  children,
  value,
  onChange,
}: {
  label: string;
  id: string;
  name: string;
  helpBlock?: string;
  children: ReactNode;
  value?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
}) => {
  return (
    <div className="mb-3">
      <div className="row gap-2 gap-sm-0 justify-content-between align-items-center">
        <div className="col-12 col-sm-6">
          <label
            htmlFor={id}
            className="fw-semibold flex-grow-1 d-flex gap-2 align-items-center"
          >
            {label}
          </label>
          {helpBlock && (
            <Form.Text className="d-inline-block mt-0 lh-2" id={id + "HelpBlock"}>
              {helpBlock}
            </Form.Text>
          )}
        </div>
        <div className="col-12 col-sm-6">
          <Form.Select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
          >
            {children}
          </Form.Select>
        </div>
      </div>

    </div>
  );
};

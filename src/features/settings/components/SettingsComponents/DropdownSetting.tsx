import Form from "react-bootstrap/Form";
import type {ChangeEventHandler, ReactNode} from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {ArrowClockwise} from "react-bootstrap-icons";

export const DropdownSetting = ({
  label,
  name,
  id,
  helpBlock,
  children,
  value,
  onChange,
  ogValue,
  onClickReset,
}: {
  label: string;
  id: string;
  name: string;
  helpBlock?: string;
  children: ReactNode;
  value?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  ogValue?: string | number;
  onClickReset?: () => void;
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
            {(typeof ogValue !== "undefined" && ogValue !== null)
            && ogValue !== value ? (
              <OverlayTrigger overlay={<Tooltip>Reset to default</Tooltip>}>
                <button
                  type="button"
                  onClick={onClickReset}
                  className="ms-2 p-0 border-0 bg-transparent d-flex align-items-center"
                >
                  <span className="visually-hidden">Reset to default</span>
                  <ArrowClockwise/>
                </button>
              </OverlayTrigger>
            ) : ""}
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

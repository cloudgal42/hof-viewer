import Form from "react-bootstrap/Form";
import type {ChangeEventHandler} from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {ArrowClockwise} from "react-bootstrap-icons";

export const RangeSetting = ({
                               label,
                               name,
                               id,
                               helpBlock,
                               min,
                               max,
                               value,
                               onChange,
                               ogValue,
                               onClickReset,
                             }: {
  label: string;
  id: string;
  name: string;
  helpBlock?: string;
  min: string | number;
  max: string | number;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
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
            <Form.Text
              className="d-inline-block mt-0 lh-2"
              id={id + "HelpBlock"}
            >
              {helpBlock}
            </Form.Text>
          )}
        </div>
        <div className="col-12 col-sm-6 d-flex gap-3 flex-nowrap align-items-center">
          <Form.Range
            id={id}
            name={name}
            min={min}
            max={max}
            value={value}
            onChange={onChange}
          />
          <Form.Control
            style={{maxWidth: "50px"}}
            size="sm"
            type="number"
            id={id + "Control"}
            name={name + "Control"}
            min={min}
            max={max}
            aria-label={label}
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

import {Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import {ArrowClockwise, InfoCircle} from "react-bootstrap-icons";
import type {Dispatch, SetStateAction} from "react";

interface RangeSettingProps {
  name: string;
  value: number;
  ogValue: number;
  min: number;
  max: number;
  tooltipHint?: string;
  setValue: Dispatch<SetStateAction<number>>;
  inputId: string;
}

export const RangeSetting = (
  {name, value, ogValue, min, max, tooltipHint, setValue, inputId} : RangeSettingProps
) => {
  return (
    <div className="mb-2">
      <Form.Label htmlFor={inputId} className="d-flex align-items-center gap-2">
        {name}
        {tooltipHint && (
          <OverlayTrigger
            overlay={
              <Tooltip>
                {tooltipHint}
              </Tooltip>
            }
          >
            <InfoCircle/>
          </OverlayTrigger>
        )}
        {value !== ogValue && (
          <OverlayTrigger overlay={<Tooltip>Reset to last saved value</Tooltip>}>
            <button
              className="ms-2 p-0 border-0 bg-transparent d-flex align-items-center"
              onClick={() => setValue(ogValue)}
            >
              <span className="visually-hidden">Reset to last saved value</span>
              <ArrowClockwise/>
            </button>
          </OverlayTrigger>
        )}
      </Form.Label>
      <div className="d-flex align-items-center gap-4">
        <Form.Range
          id={inputId}
          aria-describedby={`${inputId}Counter`}
          min={min}
          max={max}
          value={value}
          onChange={e => setValue(parseInt(e.currentTarget.value))}
        />
        <span id={`${inputId}Counter`}>{value}</span>
      </div>
    </div>
  )
}
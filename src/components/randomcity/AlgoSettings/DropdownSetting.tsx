import {Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import type {Dispatch, SetStateAction} from "react";
import {ArrowClockwise} from "react-bootstrap-icons";
import type {TranslateOptions} from "../../../interfaces/RandomAlgoSettings.ts";

interface DropdownSettingProps {
  name: string;
  value: string;
  ogValue: TranslateOptions;
  setValue: Dispatch<SetStateAction<TranslateOptions>>;
  inputId: string;
}

export const DropdownSetting = (
  {name, value, ogValue, setValue, inputId}: DropdownSettingProps
) => {
  console.log(ogValue);
  return (
    <div className="mb-2 row align-items-center gx-2">
      <div className="col-6 col-sm-4">
        <label className="text-nowrap d-flex gap-2 align-items-center" htmlFor={inputId}>
          {name}
          {value !== ogValue && (
            <OverlayTrigger overlay={<Tooltip>Reset to last saved value</Tooltip>}>
              <button
                className="ms-auto p-0 border-0 bg-transparent d-flex align-items-center"
                onClick={() => setValue(ogValue)}
              >
                <span className="visually-hidden">Reset to last saved value</span>
                <ArrowClockwise/>
              </button>
            </OverlayTrigger>
          )}
        </label>
      </div>
      <div className="col-6 col-sm-8">
        <Form.Select
          id={inputId}
          value={value}
          onChange={(e) => setValue(e.target.value as TranslateOptions)}
        >
          <option value="none">Do not translate</option>
          <option value="transliterate">Transliterate</option>
          <option value="translate">Translate</option>
        </Form.Select>
      </div>
    </div>
  )
}

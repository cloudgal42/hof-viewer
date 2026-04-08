import Form from "react-bootstrap/Form";

export const RangeSetting = ({
  label,
  name,
  id,
  helpBlock,
  min,
  max,
}: {
  label: string;
  id: string;
  name: string;
  helpBlock?: string;
  min: string | number;
  max: string | number;
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
          />
        </div>
      </div>
    </div>
  );
};

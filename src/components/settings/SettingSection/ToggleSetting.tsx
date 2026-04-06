import Form from "react-bootstrap/Form";

export const ToggleSetting = ({
  label,
  name,
  id,
  helpBlock,
} : {
  label: string;
  id: string;
  name: string;
  helpBlock?: string;
}) => {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between">
        <label htmlFor={id} className="fw-semibold d-flex gap-2 align-items-center">
          {label}
        </label>
        <Form.Check
          type="switch"
          name={name}
          id={id}
        >
        </Form.Check>
      </div>
      {helpBlock && (
        <Form.Text id={id + "HelpBlock"}>
          {helpBlock}
        </Form.Text>
      )}
    </div>
  )
}
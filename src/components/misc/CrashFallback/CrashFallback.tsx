import {Alert, Button, Card} from "react-bootstrap";
import NeedHelpEmu from "../../../assets/i-need-help-emu.webp";
import {useState} from "react";

export const CrashFallback = (
  {err}: { err: Error }
) => {
  const [isCopied, setIsCopied] = useState(false);

  function copyToClipboard() {
    if (err.stack) {
      navigator.clipboard.writeText(err.stack).then(() => setIsCopied(true));
    }
  }

  return (
    <Alert variant="danger" className="my-5 mx-2 mx-md-5 align-self-lg-center" style={{maxWidth: "1200px"}}>
      <img
        className="object-fit-contain w-25 w-lg-15"
        src={NeedHelpEmu}
        alt="Emu Otori sticker from Project Sekai saying 'I need help'"
      />
        <h1>
          <Alert.Heading>Uh oh!</Alert.Heading>
        </h1>
        <p>
          Something went wrong while rendering the UI for this website :(. If you believe
          this is a bug, please report it on
          <Alert.Link
            href="https://github.com/cloudgal42/hof-viewer/issues"
            target="_blank"
          > GitHub
          </Alert.Link>. Please ensure your report include reproduction steps as well as the error stacktrace.
        </p>
        <p>Alternatively, try <Alert.Link href={window.location.toString()}>reloading the page.</Alert.Link></p>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="fs-5 mb-0">Stacktrace:</h2>
          {isCopied ? (
            <Button
              variant="outline-danger"
              onClick={copyToClipboard}
              disabled={true}
            >
              Copied!
            </Button>
          ) : (
            <Button
              variant="outline-danger"
              onClick={copyToClipboard}
            >
              Copy to clipboard
            </Button>
          )}
        </div>
        <Card>
          <Card.Body>
          <pre style={{maxHeight: "50vh", maxWidth: "100%"}}>
            {!(err.stack?.includes(err.message)) && `${err.message}\n`}
            {err.stack || err.message}
          </pre>
          </Card.Body>
        </Card>

    </Alert>
  )
}
import SadChirper from "../../../assets/sadChirpyOutline.svg";
import type {ReactNode} from "react";

interface ErrorScreenProps {
  errorSummary: string | ReactNode;
  errorDetails?: string | ReactNode;
}

export const ErrorScreen = ({errorSummary, errorDetails}: ErrorScreenProps) => {
  return (
    <div className="d-flex flex-column align-items-center text-center">
      <img src={SadChirper} width="148" height="148" alt=""/>
      <p className="text-muted mb-1">{errorSummary}</p>
      <div className="text-muted mb-1">{errorDetails}</div>
    </div>
  )
}
export class FetchError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "FetchError";

    Object.setPrototypeOf(this, FetchError.prototype);
  }
}
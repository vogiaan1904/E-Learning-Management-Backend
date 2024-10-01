export class CustomError extends Error {
  statusCode: number;
  status: string;
  data?: string | object;
  section?: string;

  constructor(
    message: string,
    statusCode: number,
    data?: string | object,
    section?: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "";
    this.data = data;
    this.section = section;

    Error.captureStackTrace(this, this.constructor);
  }
}

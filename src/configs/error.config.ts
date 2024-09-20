export class CustomError extends Error {
  statusCode: number;
  status: string;
  data?: string | object;

  constructor(message: string, statusCode: number, data?: string | object) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "";
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

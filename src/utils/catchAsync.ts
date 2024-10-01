/* eslint-disable  @typescript-eslint/no-explicit-any */

export default (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

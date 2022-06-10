import { Request, Response, NextFunction } from 'express';
import { ErrorDto } from '../core.dto';
/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
function handleError(
  err: TypeError | ErrorDto,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let customError = err;

  /* Throw a general error, if error is unknown */
  if (!(err instanceof ErrorDto)) {
    customError = new ErrorDto(
      'Something went wrong with our server',
      500
    );
  }

  res.status(((customError as ErrorDto).status)).send(customError);
};

export default handleError;
import { Request, Response, RequestHandler, NextFunction } from "express";
import logger from "../logger";

export default function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(err.message);
  res.status(400).json({ msg: "Unexpected error has occurred." });
}

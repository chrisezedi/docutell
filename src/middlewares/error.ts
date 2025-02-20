import { NextFunction, Request, Response } from "express";
import { CustomError } from "models/generics";
import { createLogger, format, transports } from "winston";

export const errorHandler = (
  error: any,
  _: Request,
  res: Response,
  _next: NextFunction
) => {
  const { combine, timestamp, json } = format;
  const logger = createLogger({
    level: "error",
    format: combine(timestamp(), json()),
    transports: [new transports.Console(),new transports.File({ filename: "errors.log" })],
  });

  let log: CustomError = { status: 500, message: "Something Went Wrong", name:"" };

  const childLogger = logger.child(log);

  if (error?.thirdPartyError) {
    log = { ...log, ...error };
    childLogger.error(log);
    res.status(500).send(log.message);
  } else if (error.status == 403) {
    res.status(403).send("Not allowed by cors")
  }
};
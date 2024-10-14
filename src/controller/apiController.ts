import { NextFunction, Request, Response } from "express";
import httpResponse from "../utils/httpResponse";
import { EResponseStatusCode } from "../constant/application";
import httpError from "../utils/httpError";

export default {
  self: (req: Request, res: Response, next: NextFunction) => {
    try {
      throw new Error("This is an error");
      httpResponse(req, res, EResponseStatusCode.OK, "Hello World", { name: "John Doe" });
    } catch (error) {
      httpError(next, error, req);
    }
  }
};


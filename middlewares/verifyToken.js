import JWT from "jsonwebtoken";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export const AuthGaurd = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeader) {
    return next(new CustomError("Token is Required", 401, STATUS.ERROR));
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    req["user"] = payload;
    next();
  } catch (error) {
    return next(new CustomError("Error Invalid Token", 401, STATUS.FAIL));
  }
};

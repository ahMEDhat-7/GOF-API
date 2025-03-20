import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";
import { VerifyToken } from "../utils/generateToken.js";
import { GroupService } from "../services/group.service.js";
import { OrderService } from "../services/order.service.js";

const groupService = new GroupService();
const orderService = new OrderService();
export class Gaurd {
  constructor() {}

  static Auth = (req, res, next) => {
    const authHeader =
      req.headers["Authorization"] || req.headers["authorization"];
    if (!authHeader) {
      return next(new CustomError("Token is Required", 401, STATUS.ERROR));
    }
    const token = authHeader.split(" ")[1];
    try {
      req["user"] = VerifyToken(token);
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Error Invalid Token", status: 401 });
    }
  };

  static isAdmin = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "No token provided", status: 401 });
      }
      const token = authHeader.split(" ")[1];
      const payload = VerifyToken(token);
      if (payload.role !== "admin") {
        return res.status(403).json({
          message: "Forbidden: Admin access only",
          status: 403,
        });
      } else {
        req["user"] = payload;
        next();
      }
    } catch (err) {
      res.status(401).json({
        message: "Unauthorized: Invalid or expired token",
        status: 401,
      });
    }
  };

  static isGroupOwner = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "No token provided", status: 401 });
      }
      const token = authHeader.split(" ")[1];
      const payload = VerifyToken(token);
      const owner = await groupService.findOwner(payload.id);
      if (
        owner.find((g) => g.id === req.params.id) ||
        payload.role === "admin"
      ) {
        req["user"] = payload;
        next();
      } else {
        res
          .status(403)
          .json({ message: "Forbidden: Owner access only", status: 403 });
      }
    } catch (err) {
      console.error("Error verifying token:", err.message);
      res.status(401).json({
        message: "Unauthorized: Invalid or expired token",
        status: 401,
      });
    }
  };
  static isOrderOwner = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }
      const token = authHeader.split(" ")[1];
      const payload = VerifyToken(token);
      const owner = await orderService.findOwner(payload.id);
      if (
        owner.find((o) => o.id === req.params.id) ||
        payload.role === "admin"
      ) {
        req["user"] = payload;
        next();
      } else {
        res
          .status(403)
          .json({ message: "Forbidden: Owner access only", status: 403 });
      }
    } catch (err) {
      console.error("Error verifying token:", err.message);
      res.status(401).json({
        message: "Unauthorized: Invalid or expired token",
        status: 401,
      });
    }
  };
}

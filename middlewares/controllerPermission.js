import JWT from "jsonwebtoken";
import { Group } from "../models/Schema.js";
import { Order } from "../models/Schema.js";

const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);
    decodedToken.role_name !== "admin"
      ? res.status(403).json({ message: "Forbidden: Admin access only" })
      : next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

const isGroupOwner = async (req, res, next) => {
  try {
    const group_name = req.params.group_name;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);

    (await Group.findOne({
      where: {
        created_by_username: decodedToken.username,
        created_by_company: decodedToken.company_name,
        group_name,
      },
    })) || decodedToken.role_name === "admin"
      ? next()
      : res.status(403).json({ message: "Forbidden: Owner access only" });
  } catch (err) {
    console.error("Error verifying token:", err.message);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
const isOrderOwner = async (req, res, next) => {
  try {
    const { ordered_by_group_name, item_name, option, note } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);
    (await Order.findOne({
      where: {
        ordered_by_username: decodedToken.username,
        ordered_by_company: decodedToken.company_name,
        ordered_by_group_name,
        item_name,
        option,
        note,
      },
    })) ||
    decodedToken.role_name === "admin" ||
    (await Group.findOne({
      where: {
        created_by_username: decodedToken.username,
        created_by_company: decodedToken.company_name,
        group_name: ordered_by_group_name,
      },
    }))
      ? next()
      : res.status(403).json({ message: "Forbidden: Owner access only" });
  } catch (err) {
    console.error("Error verifying token:", err.message);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export default { isAdmin, isGroupOwner, isOrderOwner };

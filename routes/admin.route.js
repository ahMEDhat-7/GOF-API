import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { AdminService } from "../services/admin.service.js";
import { UserService } from "../services/user.service.js";
import { CompanyService } from "../services/company.service.js";

const router = Router();
const adminController = new AdminController(
  new AdminService(new UserService(), new CompanyService())
);

router.route("/signup").post(adminController.register);
router.route("/login").post(adminController.login);

export default router;

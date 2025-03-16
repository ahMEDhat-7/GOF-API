import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { UserService } from "../services/user.service.js";
import { CompanyService } from "../services/company.service.js";

const router = Router();
const authController = new AuthController(
  new UserService(),
  new CompanyService()
);

router.route("/login").post(authController.login);
router.route("/signup").post(authController.register);

export default router;

import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { UserService } from "../services/user.service.js";
import { AuthGaurd } from "./../middlewares/Auth.js";

const router = Router();
const userController = new UserController(new UserService());

router.route("").get(AuthGaurd.isAdmin, userController.find);
router.route("/:id").delete(userController.remove);
router.route("/profile").get(userController.findOne);
export default router;

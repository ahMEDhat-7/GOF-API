import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { UserService } from "../services/user.service.js";

const router = Router();
const userController = new UserController(new UserService());

router.route("/:id").get(userController.find).delete(userController.remove);

export default router;

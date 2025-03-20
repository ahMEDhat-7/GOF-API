import { Router } from "express";
import { MenuController } from "../controllers/menu.controller.js";
import { MenuService } from "../services/menu.service.js";
import { RestaurantService } from "../services/restaurant.service.js";
import { Gaurd } from "./../middlewares/Auth.js";
const router = Router();

const menuController = new MenuController(
  new MenuService(),
  new RestaurantService()
);
router
  .route("/:id")
  .get(menuController.find)
  .post(Gaurd.isAdmin, menuController.create)
  .patch(Gaurd.isAdmin, menuController.update)
  .delete(Gaurd.isAdmin, menuController.remove);

export default router;

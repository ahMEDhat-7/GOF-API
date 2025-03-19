import { Router } from "express";
import { MenuController } from "../controllers/menu.controller.js";
import { MenuService } from "../services/menu.service.js";
import { RestaurantService } from "../services/restaurant.service.js";
import { AuthGaurd } from "./../middlewares/Auth.js";
const router = Router();

const menuController = new MenuController(
  new MenuService(),
  new RestaurantService()
);
router
  .route("/:restaurant_id")
  .get(menuController.find)
  .post(AuthGaurd.isAdmin, menuController.create)
  .patch(AuthGaurd.isAdmin, menuController.update)
  .delete(AuthGaurd.isAdmin, menuController.remove);

export default router;

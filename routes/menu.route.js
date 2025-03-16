import { Router } from "express";
import { MenuController } from "../controllers/menu.controller.js";
import { MenuService } from "../services/menu.service.js";
import { RestaurantService } from "../services/restaurant.service.js";
const router = Router();

const menuController = new MenuController(
  new MenuService(),
  new RestaurantService()
);
router.route("/").post(menuController.create);
router
  .route("/:restaurant_name")
  .get(menuController.findOne)
  .patch(menuController.update)
  .delete(menuController.remove);

export default router;

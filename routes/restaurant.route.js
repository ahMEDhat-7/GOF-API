import { Router } from "express";
import { RestaurantController } from "../controllers/restaurant.controller.js";
import { RestaurantService } from "./../services/restaurant.service.js";

const router = Router();

const restaurantController = new RestaurantController(new RestaurantService());

router
  .route("/")
  .get(restaurantController.find)
  .post(restaurantController.create);
router
  .route("/:restaurant_name")
  .get(restaurantController.findOne)
  .patch(restaurantController.update)
  .delete(restaurantController.remove);

export default router;

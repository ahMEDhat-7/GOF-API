import { Router } from "express";
import { RestaurantController } from "../controllers/restaurant.controller.js";
import { RestaurantService } from "./../services/restaurant.service.js";
import { AuthGaurd } from "./../middlewares/Auth.js";

const router = Router();

const restaurantController = new RestaurantController(new RestaurantService());

router
  .route("/")
  .get(restaurantController.find)
  .post(AuthGaurd.isAdmin, restaurantController.create);
router
  .route("/:id")
  .get(restaurantController.findOne)
  .patch(AuthGaurd.isAdmin, restaurantController.update);

export default router;

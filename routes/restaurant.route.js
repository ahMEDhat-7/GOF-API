import { Router } from "express";
import { RestaurantController } from "../controllers/restaurant.controller.js";
import { RestaurantService } from "./../services/restaurant.service.js";
import { Gaurd } from "./../middlewares/Auth.js";

const router = Router();

const restaurantController = new RestaurantController(new RestaurantService());

router
  .route("/")
  .get(restaurantController.find)
  .post(Gaurd.isAdmin, restaurantController.create);
router
  .route("/:id")
  .get(restaurantController.findOne)
  .patch(Gaurd.isAdmin, restaurantController.update);

export default router;

import asyncWrapper from "../middlewares/asyncWrapper.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";
import {
  RestaurantDTO,
  UpdatedRestaurantDTO,
} from "./../dtos/restaurant.dto.js";

/**
 * Restaurant Controller
 * @param {RestaurantService} restaurantService
 */
export class RestaurantController {
  constructor(restaurantService) {
    this.restaurantService = restaurantService;
  }
  create = asyncWrapper(async (req, res, next) => {
    try {
      const { restaurant_name, phone_number, img } = req.body;
      const company_id = req["user"].id;

      const restDTO = new RestaurantDTO(
        restaurant_name,
        phone_number,
        img,
        company_id
      );
      const restaurant = await this.restaurantService.create(restDTO);
      res.status(201).json({
        status: STATUS.SUCCESS,
        data: "Restaurant created .",
      });
    } catch (error) {
      next(error);
    }
  });

  find = asyncWrapper(async (req, res, next) => {
    try {
      const restaurants = await this.restaurantService.find();
      res.status(200).json({ status: STATUS.SUCCESS, data: restaurants });
    } catch (error) {
      next(error);
    }
  });

  findOne = asyncWrapper(async (req, res, next) => {
    try {
      const id = req.params.id;
      const restaurant = await this.restaurantService.findOne(id);
      if (!restaurant) {
        return next(new CustomError("Restaurant not found", 404, STATUS.ERROR));
      }
      res.status(200).json({ status: STATUS.SUCCESS, data: restaurant });
    } catch (error) {
      next(error);
    }
  });

  update = asyncWrapper(async (req, res, next) => {
    try {
      const id = req.params.id;
      const { restaurant_name, phone_number, img } = req.body;
      const updatedRestDTO = new UpdatedRestaurantDTO(
        restaurant_name,
        phone_number,
        img
      );
      const updatedRest = await this.restaurantService.update(
        id,
        updatedRestDTO
      );
      res
        .status(200)
        .json({ message: "Restaurant Updated", status: STATUS.SUCCESS });
    } catch (error) {
      next(error);
    }
  });
}

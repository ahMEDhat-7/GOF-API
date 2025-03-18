import asyncWrapper from "../middlewares/asyncWrapper.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";
import { RestaurantDTO } from "./../dtos/restaurant.dto.js";

export class RestaurantController {
  constructor(restaurantService) {
    this.restaurantService = restaurantService;
  }
  create = asyncWrapper(async (req, res, next) => {
    try {
      const { restaurant_name, phone_number, img, company_id } = req.body;
      const restDTO = new RestaurantDTO(
        restaurant_name,
        phone_number,
        img,
        company_id
      );
      const newRestaurant = await this.restaurantService.create(restDTO);
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
      const restData = req.params;
      const restaurant = await this.restaurantService.findOne(restData);
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
      const { restaurant_name } = req.params;
      const updateData = req.body;
      const restData = { ...req.body, ...req.params };
      const updatedRestaurant = await this.restaurantService.update(
        restaurant_name,
        updateData
      );
      res.status(200).json({ status: STATUS.SUCCESS, data: updatedRestaurant });
    } catch (error) {
      next(error);
    }
  });

  remove = asyncWrapper(async (req, res, next) => {
    try {
      const { restaurant_name } = req.params;
      const message = await this.restaurantService.remove(restaurant_name);
      res.status(200).json({ status: STATUS.SUCCESS, data: message });
    } catch (error) {
      next(error);
    }
  });
}

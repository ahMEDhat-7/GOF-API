import { Restaurant } from "../models/Schema.js";
import { CustomError } from "../utils/customError.js";
import httpStatusText from "../utils/STATUS.js";

export class RestaurantService {
  constructor() {}
  async create(restaurantData) {
    try {
      const { restaurant_name, phone_number, img, created_by } = restaurantData;
      const extRest = await getRestaurant(restaurantData);

      if (extRest) {
        throw new CustomError(
          "Restaurant already exists",
          400,
          httpStatusText.ERROR
        );
      }

      const newRest = await Restaurant.create({
        restaurant_name,
        phone_number,
        img,
        created_by,
      });
      return newRest;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async find() {
    try {
      const restaurants = await Restaurant.findAll();
      return restaurants;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async findOne(restData) {
    try {
      const { restaurant_name } = restData;

      const extRest = await Restaurant.findOne({
        where: { restaurant_name },
      });

      if (!extRest) {
        return null;
      }

      return extRest;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }
}

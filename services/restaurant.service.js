import { Restaurant } from "../models/Schema.js";
import { CustomError } from "../utils/customError.js";
import httpStatusText from "../utils/STATUS.js";

export class RestaurantService {
  constructor() {}
  async create(restDTO) {
    try {
      const { restaurant_name, phone_number, img, company_id } = restDTO;
      const extRest = await this.findByName(restaurant_name);

      if (extRest) {
        throw new CustomError(
          "Restaurant already exists",
          400,
          httpStatusText.ERROR
        );
      }

      const Rest = await Restaurant.create({
        restaurant_name,
        phone_number,
        img,
        company_id,
      });
      return Rest;
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
  async findByName(restaurant_name) {
    try {
      const rest = await Restaurant.findOne({
        where: { restaurant_name },
      });

      if (!rest) {
        return null;
      }
      return rest;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
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

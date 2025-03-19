import { Restaurant } from "../models/Schema.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";
export class RestaurantService {
  constructor() {}
  async create(restDTO) {
    try {
      const { restaurant_name, phone_number, img, company_id } = restDTO;
      const extRest = await this.findByName(restaurant_name);

      if (extRest) {
        throw new CustomError("Restaurant already exists", 400, STATUS.ERROR);
      }

      const Rest = await Restaurant.create({
        restaurant_name,
        phone_number,
        img,
        company_id,
      });
      return Rest;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async find() {
    try {
      const restaurants = await Restaurant.findAll({
        attributes: ["id", "restaurant_name", "phone_number", "img"],
      });
      return restaurants;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
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
  async findOne(id) {
    try {
      const rest = await Restaurant.findOne({
        where: { id },
      });

      if (!rest)
        throw new CustomError("Restaurant Not Found", 404, STATUS.ERROR);

      return rest;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async update(id, restData) {
    try {
      const extRest = await this.findOne(id);
      if (!extRest) {
        throw new CustomError("Restaurant Not Found", 404, STATUS.ERROR);
      }

      console.log(restData);

      const [Rest] = await Restaurant.update(restData, { where: { id } });
      if (Rest > 0) {
        return Rest;
      }
      throw new CustomError("Nothing updated", 204, STATUS.ERROR);
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }
}

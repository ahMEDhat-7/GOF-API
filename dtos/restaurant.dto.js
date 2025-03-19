import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class RestaurantDTO {
  constructor(restaurant_name, phone_number, img, company_id) {
    const input = [restaurant_name, phone_number, company_id];

    input.forEach((i) => {
      if (typeof i !== "string" && (i === null || i === undefined)) {
        throw new CustomError("Invalid Input", 400, STATUS.ERROR);
      }
    });

    this.restaurant_name = restaurant_name;
    this.phone_number = phone_number;
    this.img = img;
    this.company_id = company_id;
  }
}

export class UpdatedRestaurantDTO {
  constructor(restaurant_name, phone_number, img) {
    if (restaurant_name && typeof restaurant_name === "string") {
      this.restaurant_name = restaurant_name;
    }
    if (phone_number && typeof phone_number === "string") {
      this.phone_number = phone_number;
    }
    if (img && typeof img === "string") {
      this.img = img;
    }
  }
}

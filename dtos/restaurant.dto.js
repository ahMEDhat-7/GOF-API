import customError from "../utils/customError";
import httpStatusText from "../utils/STATUS";

export class RestaurantDTO {
  constructor(restaurant_name, phone_number, img, created_by_company_id) {
    const input = [restaurant_name, phone_number, img, created_by_company_id];

    input.forEach((i) => {
      if (typeof i !== "string" && (i === null || i === undefined)) {
        throw new customError("Invalid Input", 400, httpStatusText.ERROR);
      }
    });

    this.restaurant_name = restaurant_name;
    this.phone_number = phone_number;
    this.img = img;
    this.created_by_company_id = created_by_company_id;
  }
}

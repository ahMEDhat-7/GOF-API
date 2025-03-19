import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class CreateMenuDTO {
  constructor(item_name, restaurant_id, options, img) {
    const input = [item_name, restaurant_id, options];

    input.forEach((i) => {
      if (typeof i !== "string" && (i === null || i === undefined)) {
        throw new CustomError("Invalid Input", 400, STATUS.ERROR);
      }
    });

    this.item_name = item_name;
    this.restaurant_id = restaurant_id;
    this.options = options;
    this.img = img;
  }
}

export class UpdatedMenuDTO {
  constructor(item_name, options, img) {
    if (item_name && typeof item_name === "string") {
      this.item_name = item_name;
    }
    if (options && typeof options === "string") {
      this.options = options;
    }
    if (img && typeof img === "string") {
      this.img = img;
    }
  }
}

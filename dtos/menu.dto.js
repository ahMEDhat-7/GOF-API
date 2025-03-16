import customError from "../utils/customError";
import httpStatusText from "../utils/STATUS";

export class MenuDTO {
  constructor(item_name, restaurant_id, options, img) {
    const input = [item_name, restaurant_id, img];

    input.forEach((i) => {
      if (typeof i !== "string" && (i === null || i === undefined)) {
        throw new customError("Invalid Input", 400, httpStatusText.ERROR);
      }
    });

    if (!Array.isArray(options)) {
      throw new customError(
        "options must be an array",
        400,
        httpStatusText.ERROR
      );
    }

    this.item_name = item_name;
    this.restaurant_id = restaurant_id;
    this.options = options;
    this.img = img;
  }
}

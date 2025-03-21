import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class CreateOrderDto {
  constructor(user_id, menu_item_id, options, quantity, note) {
    const input = [user_id, menu_item_id, options];
    input.forEach((i) => {
      if (typeof i !== "string" && (i === null || i === undefined)) {
        throw new CustomError("Invalid Input", 400, STATUS.ERROR);
      }
    });

    if (typeof quantity !== "number" || quantity <= 0) {
      throw new CustomError(
        "quantity must be a positive number",
        400,
        STATUS.ERROR
      );
    }
    this.user_id = user_id;
    this.menu_item_id = menu_item_id;
    this.quantity = quantity;
    this.options = options;
    this.note = note;
  }
}

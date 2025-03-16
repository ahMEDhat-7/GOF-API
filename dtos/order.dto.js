import customError from "../utils/customError";
import httpStatusText from "../utils/STATUS";

export class OrderDTO {
  constructor(group_member_id, menu_item_id, quantity, note) {
    const input = [group_member_id, menu_item_id];

    input.forEach((i) => {
      if (typeof i !== "string" && (i === null || i === undefined)) {
        throw new customError("Invalid Input", 400, httpStatusText.ERROR);
      }
    });

    if (typeof quantity !== "number" || quantity <= 0) {
      throw new customError(
        "quantity must be a positive number",
        400,
        httpStatusText.ERROR
      );
    }

    this.group_member_id = group_member_id;
    this.menu_item_id = menu_item_id;
    this.order_status = order_status;
    this.quantity = quantity;
    this.note = note;
  }
}

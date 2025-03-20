import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class CreateGroupDto {
  constructor(group_name, user_id, company_id, restaurant_id, duration) {
    const input = [group_name, user_id, company_id, restaurant_id, duration];
    input.forEach((i) => {
      if (typeof i !== "string" && (i === null || i === undefined)) {
        throw new CustomError("Invalid Input", 400, STATUS.ERROR);
      }
    });
    this.group_name = group_name;
    this.restaurant_id = restaurant_id;
    this.user_id = user_id;
    this.company_id = company_id;
    this.duration = duration;
  }
}

export class UpdatedGroupDto {
  constructor(group_status) {
    if (group_status && typeof group_status === "string") {
      this.item_name = item_name;
    }
  }
}

import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class CreateGroupDto {
  constructor(group_name, user_id, company_id, restaurant_id, duration) {
    const input = [group_name, user_id, company_id, restaurant_id];
    input.forEach((i) => {
      if (typeof i !== "string" && (i === null || i === undefined)) {
        throw new CustomError("Invalid Input", 400, STATUS.ERROR);
      }
    });
    this.group_name = group_name;
    this.restaurant_id = restaurant_id;
    this.user_id = user_id;
    this.company_id = company_id;
    this.duration = typeof duration === "number" ? duration : 0;
  }
}

export class UpdatedGroupDto {
  constructor(group_name, duration, group_status) {
    if (group_status && typeof group_status === "string") {
      this.group_status = group_status;
    }
    if (duration && typeof duration === "number") {
      this.duration = duration;
    }
    if (group_name && typeof group_name === "string") {
      this.group_name = group_name;
    }
  }
}

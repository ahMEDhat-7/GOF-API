import customError from "../utils/customError";
import httpStatusText from "../utils/STATUS";

export class GroupDTO {
  constructor(
    group_name,
    created_by,
    restaurant_id,
    group_status,
    duration,
    created_at,
    updated_at
  ) {
    const input = [
      group_name,
      created_by,
      restaurant_id,
      group_status,
      duration,
      created_at,
      updated_at,
    ];
    input.forEach((i) => {
      if (typeof i !== "string" && (i === null || i === undefined)) {
        throw new customError("Invalid Input", 400, httpStatusText.ERROR);
      }
    });
    this.group_name = group_name;
    this.created_by = created_by;
    this.restaurant_id = restaurant_id;
    this.group_status = group_status;
    this.duration = duration;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class UserDTO {
  constructor(username, company_id, phone_number) {
    const input = [username, company_id, phone_number];

    input.forEach((i) => {
      if (typeof i !== "string" && (i === null || i === undefined)) {
        throw new CustomError("Invalid Input", 400, STATUS.ERROR);
      }
    });
    this.username = username;
    this.company_id = company_id;
    this.phone_number = phone_number;
  }
}

import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class CreateUserDto {
  constructor(username, company_id, password, phone_number) {
    const input = [username, company_id, password, phone_number];
    input.forEach((i) => {
      if (typeof i !== "string" && (i === null || i === undefined)) {
        throw new CustomError("Invalid Input", 400, STATUS.ERROR);
      }
    });
    this.username = username;
    this.company_id = company_id;
    this.password = password;
    this.phone_number = phone_number;
  }
}
export class LoginUserDto {
  constructor(username, password) {
    const input = [username, password];
    input.forEach((i) => {
      if (typeof i !== "string" && (i === null || i === undefined)) {
        throw new CustomError("Invalid Input", 400, STATUS.ERROR);
      }
    });
    this.username = username;
    this.password = password;
  }
}

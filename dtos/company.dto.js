import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class CompanyDTO {
  constructor(company_name, password) {
    const input = [company_name, password];
    input.forEach((i) => {
      if (typeof i !== "string" && (i === null || i === undefined)) {
        throw new CustomError("Invalid Input", 400, STATUS.ERROR);
      }
    });
    this.company_name = company_name;
    this.password = password;
  }
}

import asyncWrapper from "../middlewares/asyncWrapper.js";
import { CompanyDTO } from "../dtos/company.dto.js";

export class CompanyController {
  constructor(companyService) {
    this.companyService = companyService;
  }
}

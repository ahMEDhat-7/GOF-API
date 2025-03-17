import asyncWrapper from "../middlewares/asyncWrapper.js";
import { CompanyDTO } from "../dtos/company.dto.js";

export class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }
  register = asyncWrapper(async (req, res, next) => {
    try {
      const { company_name, password } = req.body;
      const adminDto = new CompanyDTO(company_name, password);
      const newCompany = await this.adminService.register(adminDto);
      return res.status(201).json(newCompany);
    } catch (error) {
      return next(error);
    }
  });

  login = asyncWrapper(async (req, res, next) => {
    try {
      const { company_name, password } = req.body;
      const adminDto = new CompanyDTO(company_name, password);
      const admin = await this.adminService.login(adminDto);
      return res.status(200).json(admin);
    } catch (error) {
      return next(error);
    }
  });
}

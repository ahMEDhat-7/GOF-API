import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";
import { getHash, hashMatch } from "../utils/getHash.js";
import generateToken from "../utils/generateToken.js";

export class AdminService {
  constructor(userService, companyService) {
    this.userService = userService;
    this.companyService = companyService;
  }
  async register(adminDto) {
    try {
      const { company_name, password } = adminDto;
      const extCompany = await this.companyService.findByName(company_name);

      if (extCompany) {
        throw new CustomError("Company already exists", 400, STATUS.FAIL);
      }
      adminDto.password = await getHash(password);
      const company = await this.companyService.create(adminDto);

      const token = generateToken({
        id: company.id,
        role: "admin",
      });
      return { token };
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async login(adminDto) {
    try {
      const { company_name, password } = adminDto;
      const company = await this.companyService.findByName(company_name);
      if (!company)
        throw new CustomError("Invalid username or password", 400, STATUS.FAIL);

      const isMatch = await hashMatch(password, company.password);

      if (!isMatch)
        throw new CustomError("Invalid username or password", 400, STATUS.FAIL);

      const token = generateToken({
        id: company.id,
        role: "admin",
      });

      return { token };
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }
  async registerUser(userDto) {}

  async loginUser(adminDto) {}
}

import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";
import { getHash, hashMatch } from "../utils/getHash.js";
import generateToken from "../utils/generateToken.js";

export class AuthService {
  constructor(userService, companyService) {
    this.userService = userService;
    this.companyService = companyService;
  }
  async register(userDto) {
    try {
      const { username, company_id, password } = userDto;
      const extCompany = await this.companyService.findOne(company_id);

      if (!extCompany)
        throw new CustomError("Company Not Found", 400, STATUS.FAIL);
      const extUser = await this.userService.findByUsername(username);
      if (extUser)
        throw new CustomError("username already exists", 400, STATUS.FAIL);

      userDto.password = await getHash(password);

      const user = await this.userService.create(userDto);

      const token = generateToken({
        id: user.id,
        role: "user",
      });
      return { token };
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async login(userDto) {
    try {
      const { username, password } = userDto;

      const user = await this.userService.findByUsername(username);
      if (!user) throw new CustomError("username not found", 400, STATUS.FAIL);

      const isMatch = await hashMatch(password, user.password);

      if (!isMatch)
        throw new CustomError("Invalid username or password", 400, STATUS.FAIL);

      const token = generateToken({
        id: user.id,
        role: "user",
      });

      return { token };
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }
}

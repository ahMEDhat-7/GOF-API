import asyncWrapper from "../middlewares/asyncWrapper.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";
import { UserDTO } from "../dtos/user.dto.js";

export class AuthController {
  constructor(userService, companyService) {
    this.userService = userService;
    this.companyService = companyService;
  }
  register = asyncWrapper(async (req, res, next) => {
    try {
      const { username, company_id, phone_number } = req.body;
      const userDto = new UserDTO(username, company_id, phone_number);

      const newUser = await this.userService.create(userDto);

      return res.status(201).json(newUser);
    } catch (error) {
      return next(error);
    }
  });

  login = asyncWrapper(async (req, res, next) => {
    try {
      const userData = req.body;
      const hasEmptyFields = Object.entries(userData).filter(
        ([key, value]) => value === "" || value === undefined
      );

      if (hasEmptyFields.length > 0) {
        throw new CustomError("Missing required fields", 400, STATUS.ERROR);
      }

      const user = await userService.getUser(userData);
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  });
}

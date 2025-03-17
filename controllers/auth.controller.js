import asyncWrapper from "../middlewares/asyncWrapper.js";

import { CreateUserDto, LoginUserDto } from "../dtos/user.dto.js";

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }
  register = asyncWrapper(async (req, res, next) => {
    try {
      const { username, company_id, password, phone_number } = req.body;
      const userDto = new CreateUserDto(
        username,
        company_id,
        password,
        phone_number
      );

      const user = await this.authService.register(userDto);

      return res.status(201).json(user);
    } catch (error) {
      return next(error);
    }
  });

  login = asyncWrapper(async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const loginDto = new LoginUserDto(username, password);
      const user = await this.authService.login(loginDto);
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  });
}

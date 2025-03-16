import asyncWrapper from "../middlewares/asyncWrapper.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class UserController {
  constructor(userService, companyService) {
    this.userService = userService;
    this.companyService = companyService;
  }
  find = asyncWrapper(async (req, res, next) => {
    try {
      const userData = req.params;
      const users = await userService.find(userData);
      return res.status(200).json(users);
    } catch (error) {
      return next(error);
    }
  });

  remove = asyncWrapper(async (req, res, next) => {
    try {
      const company = await this.companyService.findOne(req.params);
      if (!company) {
        return next(new CustomError("Company not found", 404, STATUS.FAIL));
      }
      const extUser = await userService.findOne(req.params);
      if (!extUser) {
        return next(new CustomError("user doesn't exist", 400, STATUS.FAIL));
      }
      const user = await userService.remove(req.params);
      if (!user) {
        return next(
          new CustomError("Can't remove try again ... ", 404, STATUS.FAIL)
        );
      }
      await this.companyService.update(extUser, company.users_count - 1);
      return res
        .status(200)
        .json({ status: STATUS.SUCCESS, data: "user removed." });
    } catch (error) {
      return next(error);
    }
  });
}

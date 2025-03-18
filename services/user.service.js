import { User } from "./../models/Schema.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";
import { CreateUserDto } from "../dtos/user.dto.js";

export class UserService {
  constructor() {}
  /**
   *  create a new user
   * @param {CreateUserDto} userDto
   * @returns {JWT} token
   */
  async create(userDto) {
    try {
      const { username, company_id, password, phone_number } = userDto;

      const user = await User.create({
        company_id,
        username,
        phone_number,
        password,
      });

      return user;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  /**
   * Retrive user by username
   * @param {string} username
   * @returns {User} user
   */
  async findByUsername(username) {
    try {
      const extUser = await User.findOne({
        where: { username },
      });

      if (!extUser) {
        return null;
      }
      return extUser;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async findOne(id) {
    try {
      const user = await User.findOne({
        where: { id },
        attributes: ["id", "username", "phone_number", "company_id"],
      });

      if (!user) throw new CustomError("user not found", 404, STATUS.FAIL);

      return user;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  find = async (company_id) => {
    try {
      const users = await User.findAll({
        where: { company_id },
        attributes: ["id", "username", "phone_number"],
      });
      return users;
    } catch (error) {
      return error;
    }
  };
}

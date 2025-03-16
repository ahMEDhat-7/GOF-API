import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { User } from "./../models/Schema.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";
import { UserDTO } from "../dtos/user.dto.js";

export class UserService {
  constructor() {}
  /**
   *  create a new user
   * @param {UserDTO} userDto
   * @returns {JWT} token
   */
  async create(userDto) {
    try {
      const extUser = await this.findByUsername(userDto.username);

      if (extUser) {
        throw new CustomError("User already exists", 400, STATUS.ERROR);
      }
      const password_hash = await bcrypt.hash(password, +process.env.HASH_SALT);

      const newUser = await User.create({
        company_name,
        username,
        phone_number,
        password: password_hash,
      });
      const token = generateToken({
        username,
        company_name,
        role_name: "user",
      });
      return { token };
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
      const extUser = await User.findOne({
        where: { id },
      });

      if (!extUser) {
        return null;
      }
      const isMatch = await bcrypt.compare(password, extUser.password);

      if (!isMatch)
        throw new CustomError(
          "Invalid Username or password",
          400,
          STATUS.ERROR
        );

      const token = generateToken({
        username,
        company_name: extUser.company_name,
        role_name: "user",
      });

      await User.update(
        { token },
        {
          where: {
            username,
            company_name: extUser.company_name,
          },
        }
      );
      return {
        username: extUser.username,
        company_name: extUser.company_name,
        role_name: "user",
        token,
      };
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  find = async (userData) => {
    try {
      const { company_name } = userData;
      const users = await User.findAll({ where: { company_name } });
      return users;
    } catch (error) {
      return error;
    }
  };
}

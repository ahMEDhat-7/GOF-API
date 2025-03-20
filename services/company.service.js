import { Company } from "../models/Schema.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class CompanyService {
  async create(companyDto) {
    try {
      const { company_name, password } = companyDto;
      const extCompany = await this.findByName(company_name);

      if (extCompany) {
        throw new CustomError("Company already exists", 400, STATUS.FAIL);
      }
      const password_hash = await bcrypt.hash(password, +process.env.HASH_SALT);

      const newCompany = await Company.create(companyDto);

      return newCompany.save();
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async findByName(company_name) {
    try {
      const company = await Company.findOne({ where: { company_name } });
      if (!company) {
        return null;
      }
      return company;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  /**
   * Retrive company by id
   * @param {string} id
   * @returns company
   */
  async findOne(id) {
    try {
      const company = await Company.findOne({ where: { id } });
      return company;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async update(company_name, updateData) {
    try {
      const [updated] = await Company.update(updateData, {
        where: { company_name },
      });
      if (!updated) {
        throw new CustomError("Company not found", 404, STATUS.FAIL);
      }
      const updatedCompany = await Company.findOne({ where: { company_name } });
      return updatedCompany;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async remove(company_name) {
    try {
      const deleted = await Company.destroy({ where: { company_name } });
      if (!deleted) {
        throw new CustomError("Company not found", 404, STATUS.FAIL);
      }
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }
}

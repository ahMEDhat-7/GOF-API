import { Company, Group, User } from "../models/Schema.js";
import { Op } from "sequelize";
import { calculateEndDate } from "../utils/formattedDate.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";
export class GroupService {
  async create(group) {
    try {
      const userhasGroup = await this.findRunningGroups(group.user_id);

      if (userhasGroup.length === 0) {
        group.end_date = calculateEndDate(group.duration);
        const newGroup = await Group.create(group);
        return newGroup;
      }

      throw new CustomError(
        "You have already group hasn't completed yet",
        400,
        STATUS.ERROR
      );
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async findByStatus(group_status, company_id) {
    try {
      let groups = await Group.findAll({
        where: {
          group_status,
          company_id,
        },
        include: [
          {
            model: User,
            required: true,
            attributes: ["username"],
            include: [
              {
                model: Company,
                where: { id: company_id },
                required: true,
                attributes: ["company_name"],
              },
            ],
          },
        ],
        attributes: ["group_name", "group_status", "duration"],
      });

      groups = groups.map((group) => {
        return {
          Name: group.group_name,
          Status: group.group_status,
          Owner: group.User.username,
          BelongsTo: group.User.Company.company_name,
          Duration: group.duration,
        };
      });
      return groups;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }
  async findRunningGroups(id) {
    try {
      const groups = await Group.findAll({
        where: {
          user_id: id,
          group_status: {
            [Op.notIn]: ["completed", "cancelled"],
          },
        },
      });

      return groups;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }
  async find(groupData) {
    try {
      const { created_by_company, group_status } = groupData;
      const groups = await Group.findAll({
        where: { created_by_company, group_status },
      });
      return groups;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async findOwner(id) {
    try {
      const group = await Group.findAll({
        where: {
          user_id: id,
        },
      });
      return group;
    } catch (error) {
      throw new CustomError(error.message, 500, STATUS.ERROR);
    }
  }
  async findByName(group_name) {
    try {
      const group = await Group.findOne({
        where: { group_name },
      });

      return group;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }
  async findOne(id) {
    try {
      const group = await Group.findOne({
        where: {
          id,
        },
      });

      return group;
    } catch (error) {
      throw new CustomError(error.message, 500, STATUS.ERROR);
    }
  }

  async update(groupData, id) {
    try {
      const group = await this.findOne(id);
      if (!group) {
        throw new CustomError("Group Not Found", 404, STATUS.ERROR);
      }
      const [updated] = await Group.update(groupData, {
        where: { id },
      });

      if (updated > 0) return updated;
      throw new CustomError("Nothing updated", 204, STATUS.ERROR);
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async remove(id) {
    try {
      const deleted = await Group.destroy({
        where: { id },
      });
      if (deleted > 0) return deleted;
      throw new CustomError("Cant remove Group", 400, STATUS.ERROR);
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }
}

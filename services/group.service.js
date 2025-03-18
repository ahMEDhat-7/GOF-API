import { Group } from "../models/Schema.js";
import { Op } from "sequelize";
import { CustomError } from "../utils/customError.js";
import DataFormate from "../utils/formattedDate.js";
import httpStatusText from "../utils/STATUS.js";

export class GroupService {
  async create(groupData) {
    try {
      const existingGroup = await Group.findOne({
        where: {
          created_by_username: groupData.created_by_username,
          created_by_company: groupData.created_by_company,
          group_status: {
            [Op.notIn]: ["finished", "cancelled"],
          },
        },
      });

      if (existingGroup) {
        throw new CustomError(
          "You have already group hasn't completed yet",
          400,
          httpStatusText.ERROR
        );
      }
      const extGroup = await getGroup(groupData);

      if (extGroup.message) {
        throw new CustomError(
          "Group already exists",
          400,
          httpStatusText.ERROR
        );
      }
      groupData.end_date = DataFormate.formattedDate(groupData.duration);
      const newGroup = await Group.create(groupData);

      return newGroup;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
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
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async findOwner(id) {
    try {
      const group = await Group.findOne({
        where: {
          user_id: id,
        },
      });

      if (!group) {
        return new CustomError(null, 404);
      }
      return group;
    } catch (error) {
      throw new CustomError(error.message, 500, httpStatusText.ERROR);
    }
  }
  async findOne(groupData) {
    try {
      const { group_name, created_by_company } = groupData;
      const group = await Group.findOne({
        where: {
          group_name,
          created_by_company,
        },
      });

      if (!group) {
        return new CustomError(null, 404);
      }
      return group;
    } catch (error) {
      throw new CustomError(error.message, 500, httpStatusText.ERROR);
    }
  }

  async update(groupData) {
    try {
      const { group_status, group_name, created_by_company } = groupData;
      const [updated] = await Group.update(
        { group_status },
        {
          where: { group_name, created_by_company },
        }
      );

      if (!updated) {
        throw new CustomError("Group not found", 404, httpStatusText.FAIL);
      }
      const updatedGroup = await getGroup(groupData);
      return updatedGroup;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async remove(groupData) {
    try {
      const { group_name, created_by_company } = groupData;
      const deleted = await Group.destroy({
        where: { group_name, created_by_company },
      });
      if (!deleted) {
        throw new CustomError("Group not found", 404, httpStatusText.ERROR);
      }
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }
}

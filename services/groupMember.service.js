import { GroupMember } from "../models/Schema.js";
import { CustomError } from "../utils/customError.js";

export class GroupMemberService {
  constructor() {}
  async create(groupMemberData) {
    try {
      const newGroupMember = await GroupMember.create(groupMemberData);
      return newGroupMember;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async findOne(gmData) {
    try {
      const { ordered_by_group_name, ordered_by_company, ordered_by_username } =
        gmData;
      const groupMember = await GroupMember.findOne({
        where: {
          group_name: ordered_by_group_name,
          username: ordered_by_username,
          company_name: ordered_by_company,
        },
      });
      return groupMember;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async update(group_name, username, updateData) {
    try {
      const [updated] = await GroupMember.update(updateData, {
        where: { group_name, username },
      });
      if (updated) {
        const updatedGroupMember = await GroupMember.findOne({
          where: { group_name, username },
        });
        return updatedGroupMember;
      }
      throw new CustomError(
        "Group member not found",
        404,
        httpStatusText.ERROR
      );
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async find() {
    try {
      const groupMembers = await GroupMember.findAll();
      return groupMembers;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async remove(group_name, username) {
    try {
      const deleted = await GroupMember.destroy({
        where: { group_name, username },
      });
      if (deleted) {
        return "Group member deleted";
      }
      throw new CustomError(
        "Group member not found",
        404,
        httpStatusText.ERROR
      );
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }
}

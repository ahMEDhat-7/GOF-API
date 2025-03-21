import { GroupMember } from "../models/Schema.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class GroupMemberService {
  constructor() {}
  async create(groupMemberData) {
    try {
      const newGroupMember = await GroupMember.create(groupMemberData);
      return newGroupMember;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async findOne(user_id) {
    try {
      const groupMember = await GroupMember.findOne({
        where: {
          user_id,
        },
      });
      return groupMember;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
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
      throw new CustomError("Group member not found", 404, STATUS.ERROR);
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async find() {
    try {
      const groupMembers = await GroupMember.findAll();
      return groupMembers;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
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
      throw new CustomError("Group member not found", 404, STATUS.ERROR);
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }
}

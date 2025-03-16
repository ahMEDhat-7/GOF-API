import asyncWrapper from "../middlewares/asyncWrapper.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class GroupMemberController {
  constructor(groupMemberService) {
    this.groupMemberService = groupMemberService;
  }
  create = asyncWrapper(async (req, res, next) => {
    try {
      const GroupMemberData = req.body;

      const newGroupMember = await this.groupMemberService.create(
        GroupMemberData
      );
      res.status(201).json(newGroupMember);
    } catch (error) {
      next(error);
    }
  });

  findOne = asyncWrapper(async (req, res, next) => {
    try {
      const GroupMemberData = req.params;
      const groupMember = await this.groupMemberService.findOne(
        GroupMemberData
      );
      if (!groupMember) {
        return next(
          new CustomError("Group member not found", 404, STATUS.FAIL)
        );
      }
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: groupMember,
      });
    } catch (error) {
      next(error);
    }
  });

  update = asyncWrapper(async (req, res, next) => {
    try {
      const { group_name, username } = req.params;
      const updateData = req.body;
      const GroupMemberData = { ...req.body, ...req.params };

      const updatedGroupMember = await this.groupMemberService.update(
        GroupMemberData
      );
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: updatedGroupMember,
      });
    } catch (error) {
      next(error);
    }
  });

  find = asyncWrapper(async (req, res, next) => {
    try {
      const groupMembers = await this.groupMemberService.find();
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: groupMembers,
      });
    } catch (error) {
      next(error);
    }
  });

  remove = asyncWrapper(async (req, res, next) => {
    try {
      const GroupMemberData = req.params;
      const message = await this.groupMemberService.remove(GroupMemberData);
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  });
}

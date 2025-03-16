import asyncWrapper from "../middlewares/asyncWrapper.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class GroupController {
  constructor(groupService, groupMemberService, restaurantService) {
    this.groupService = groupService;
    this.groupMemberService = groupMemberService;
    this.restaurantService = restaurantService;
  }
  create = asyncWrapper(async (req, res, next) => {
    try {
      const groupData = req.body;
      const newGroup = await this.groupService.create(groupData);
      const group_name = groupData.group_name;
      const username = groupData.created_by_username;
      const company_name = groupData.created_by_company;

      // Restaurant id

      const newGM = await this.groupMemberService.create({
        group_name,
        username,
        company_name,
      });
      return res.status(201).json(newGroup);
    } catch (error) {
      next(new CustomError(error.message, 400, STATUS.FAIL));
    }
  });

  findOne = asyncWrapper(async (req, res, next) => {
    try {
      const groupData = req.params;
      const group = await this.groupService.findOne(groupData);
      if (!group) {
        return next(new CustomError("Group not found", 404, STATUS.FAIL));
      }
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: group,
      });
    } catch (error) {
      return next(error);
    }
  });

  update = asyncWrapper(async (req, res, next) => {
    try {
      const groupData = { ...req.body, ...req.params };
      const group = await this.groupService.findOne(groupData);

      if (!group) {
        throw new CustomError("Group not found", 404, STATUS.FAIL);
      }
      const updatedGroup = await this.groupService.update(groupData);
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: updatedGroup,
      });
    } catch (error) {
      next(error);
    }
  });

  find = asyncWrapper(async (req, res, next) => {
    try {
      const groupData = req.params;

      const groups = await this.groupService.find(groupData);
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  });

  remove = asyncWrapper(async (req, res, next) => {
    try {
      const groupData = req.params;
      const message = await this.groupService.remove(groupData);
      res.status(200).json({ status: STATUS.SUCCESS, data: message });
    } catch (error) {
      next(error);
    }
  });

  updateStatus = asyncWrapper(async (req, res, next) => {
    try {
      const groupData = { ...req.params, ...req.body };
      const updatedGroup = await this.groupService.update(groupData);
      res.status(200).json(updatedGroup);
    } catch (error) {
      next(error);
    }
  });
}

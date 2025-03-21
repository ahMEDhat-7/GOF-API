import { CreateGroupDto, UpdatedGroupDto } from "../dtos/group.dto.js";
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
      const { id, C_id } = req["user"];

      const { group_name, restaurant_id, duration } = req.body;
      const groupDto = new CreateGroupDto(
        group_name,
        id,
        C_id,
        restaurant_id,
        duration
      );

      const group = await this.groupService.create(groupDto);
      const groupMember = await this.groupMemberService.create({
        user_id: id,
        group_id: group.id,
        restaurant_id,
      });

      return res.status(201).json({ status: STATUS.SUCCESS, data: group });
    } catch (error) {
      next(new CustomError(error.message, 400, STATUS.FAIL));
    }
  });

  findByStatus = asyncWrapper(async (req, res, next) => {
    try {
      const { group_status } = req.params;
      const { C_id } = req["user"];
      const group = await this.groupService.findByStatus(group_status, C_id);
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
      const { group_name, duration, group_status } = req.body;
      const updateGroupDto = new UpdatedGroupDto(
        group_name,
        duration,
        group_status
      );
      const updatedGroup = await this.groupService.update(
        updateGroupDto,
        req.params.id
      );
      res.status(200).json({
        message: "Group updated",
        status: STATUS.SUCCESS,
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
      const { id } = req.params;
      const message = await this.groupService.remove(id);
      res
        .status(200)
        .json({ status: STATUS.SUCCESS, message: "Group removed" });
    } catch (error) {
      next(error);
    }
  });
}

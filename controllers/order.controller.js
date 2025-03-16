import asyncWrapper from "../middlewares/asyncWrapper.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class OrderController {
  constructor(orderService, groupService, groupMemberService) {
    this.orderService = orderService;
    this.groupMemberService = groupMemberService;
  }
  create = asyncWrapper(async (req, res, next) => {
    try {
      const orderData = req.body;
      const GM = await this.groupMemberService.findOne(orderData);

      if (!GM) {
        await this.groupMemberService.create({
          group_name: orderData.ordered_by_group_name,
          username: orderData.ordered_by_username,
          company_name: orderData.ordered_by_company,
        });
      }

      const group = await this.groupService.findOne({
        group_name: orderData.ordered_by_group_name,
        created_by_company: orderData.ordered_by_company,
      });
      if (!group || group.group_status !== "running") {
        throw new CustomError("The group is not running", 400, STATUS.ERROR);
      }

      const newOrder = await this.orderService.create(orderData);
      res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  });

  findOne = asyncWrapper(async (req, res, next) => {
    try {
      const orderData = req.params;
      const order = await this.orderService.findOne(orderData);
      if (!order) {
        throw new CustomError("Order not found", 404, STATUS.FAIL);
      }
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  });

  update = asyncWrapper(async (req, res, next) => {
    try {
      const orderData = req.body;
      const order = await this.orderService.findOne(orderData);
      if (!order) {
        throw new CustomError("Order not found", 404, STATUS.FAIL);
      }

      const updatedOrder = await this.orderService.update(orderData);
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  });

  find = asyncWrapper(async (req, res, next) => {
    try {
      const orderData = req.params;
      const orders = await this.orderService.find(orderData);
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  });

  remove = asyncWrapper(async (req, res, next) => {
    try {
      const orderData = req.body;
      const message = await this.orderService.remove(orderData);
      res.status(200).json({ status: STATUS.SUCCESS, data: message });
    } catch (error) {
      next(error);
    }
  });

  findTotal = asyncWrapper(async (req, res, next) => {
    try {
      const orderData = req.params;
      const orders = await this.orderService.findTotal(orderData);
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  });

  findByUser = asyncWrapper(async (req, res, next) => {
    try {
      const orderData = req.params;
      const orders = await this.orderService.findByUser(orderData);
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  });

  notifyAsArrived = asyncWrapper(async (req, res, next) => {
    try {
      const orderData = req.params;
      const updatedOrder = await this.orderService.notifyAsArrived(orderData);
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  });
  findCanelled = asyncWrapper(async (req, res, next) => {
    try {
      const orderData = req.params;
      const order = await this.orderService.findCanelled(orderData);
      if (!order) {
        throw new CustomError("Order not found", 404, STATUS.FAIL);
      }
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  });
}

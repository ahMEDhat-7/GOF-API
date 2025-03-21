import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { GroupMemberService } from "../services/groupMember.service.js";
import { GroupService } from "../services/group.service.js";
import { OrderService } from "./../services/order.service.js";

const router = Router();

const orderController = new OrderController(
  new OrderService(),
  new GroupService(),
  new GroupMemberService()
);

router.route("/:id").post(orderController.create);
router
  .route("/total/:ordered_by_company/:ordered_by_group_name")
  .get(orderController.findTotal);
router
  .route("/g/:ordered_by_company/:ordered_by_group_name")
  .get(orderController.find);

router
  .route("/:ordered_by_company/:ordered_by_username")
  .get(orderController.findByUser);

router.route("/").patch(orderController.update).delete(orderController.remove);

router
  .route("/arrived/:ordered_by_company/:ordered_by_group_name")
  .patch(orderController.notifyAsArrived);

router
  .route("/msg/:ordered_by_company/:ordered_by_username/:ordered_by_group_name")
  .get(orderController.findCanelled);

export default router;

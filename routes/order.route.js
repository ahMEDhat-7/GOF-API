import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { GroupMemberService } from "../services/groupMember.service.js";
import { GroupService } from "../services/group.service.js";
import { OrderService } from "./../services/order.service.js";
import { Gaurd } from "./../middlewares/Auth.js";

const router = Router();

const orderController = new OrderController(
  new OrderService(),
  new GroupService(),
  new GroupMemberService()
);

router.route("/:id").post(orderController.create);
router.route("/total/:id").get(Gaurd.isGroupOwner, orderController.findTotal);
router.route("/").get(orderController.find);

router.route("/").patch(orderController.update).delete(orderController.remove);

router.route("/arrived/:id").patch(orderController.notifyAsArrived);

router
  .route("/msg/:ordered_by_company/:ordered_by_username/:ordered_by_group_name")
  .get(orderController.findCanelled);

export default router;

import { Router } from "express";
import { GroupController } from "../controllers/group.controller.js";
import { GroupService } from "../services/group.service.js";
import { GroupMemberService } from "../services/groupMember.service.js";
import { RestaurantService } from "../services/restaurant.service.js";
import { Gaurd } from "./../middlewares/Auth.js";

const router = Router();
const groupController = new GroupController(
  new GroupService(),
  new GroupMemberService(),
  new RestaurantService()
);

router.route("/:group_status").get(groupController.findByStatus);

router.route("/").post(groupController.create);

router
  .route("/:id")
  .patch(Gaurd.isGroupOwner, groupController.update)
  .delete(Gaurd.isGroupOwner, groupController.remove);

export default router;

import { Router } from "express";
import { GroupController } from "../controllers/group.controller.js";
import { GroupService } from "../services/group.service.js";
import { GroupMemberService } from "../services/groupMember.service.js";
import { RestaurantService } from "../services/restaurant.service.js";

const router = Router();
const groupController = new GroupController(
  new GroupService(),
  new GroupMemberService(),
  new RestaurantService()
);

router.route("/").post(groupController.create);
router.route("/:created_by_company/:group_status").get(groupController.find);

router
  .route("/:created_by_company/:group_name")
  .patch(groupController.update)
  .delete(groupController.remove);

export default router;

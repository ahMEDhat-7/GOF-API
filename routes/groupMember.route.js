import { Router } from "express";
import { GroupMemberController } from "../controllers/groupMember.controller.js";
import { GroupMemberService } from "../services/groupMember.service.js";

const router = Router();

const groupMemberController = new GroupMemberController(
  new GroupMemberService()
);

router.route("/").post(groupMemberController.create);
router.route("/:id").get(groupMemberController.findOne);

export default router;

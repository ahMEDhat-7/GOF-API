// filepath: /f:/Practicing/breakfast/BreakFastOrder/services/scheduler.service.js
import cron from "node-cron";
import { Group, Order } from "../models/Schema.js";

let task;
const updateGroupDurations = async () => {
  try {
    const groups = await Group.findAll({ where: { group_status: "running" } });

    if (groups.length === 0) {
      await Order.update(
        { order_status: "pending" },
        {
          where: {
            order_status: "running",
          },
        }
      );
      // task.stop();
      // return;
    }
    for (const group of groups) {
      let { duration } = group;

      if (duration > 0) {
        duration -= 1;
        await Group.update(
          { duration },
          {
            where: {
              id: group.id,
            },
          }
        );

        if (duration === 0) {
          await Group.update(
            { group_status: "pending" },
            {
              where: {
                id: group.id,
              },
            }
          );
        }
      }
    }
  } catch (error) {
    console.error(
      "Error updating group durations and statuses:",
      error.message
    );
  }
};
const startTask = () => {
  if (!task || !task.running) {
    task = cron.schedule("* * * * *", updateGroupDurations);
    console.log("<|-|>");
  }
};

export { startTask };

// filepath: /f:/Practicing/breakfast/BreakFastOrder/services/scheduler.service.js
import cron from "node-cron";
import { Group, Order } from "../models/Schema.js";

let task;
const updateGroupDurations = async () => {
  try {
    const groups = await Group.findAll({ where: { group_status: "running" } });
    const orders = await Order.findAll({ where: { order_status: "running" } });
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
              group_name: group.group_name,
              created_by_company: group.created_by_company,
            },
          }
        );

        if (duration === 0) {
          await Group.update(
            { group_status: "pending" },
            {
              where: {
                group_name: group.group_name,
                created_by_company: group.created_by_company,
              },
            }
          );
          await Order.update(
            { order_status: "pending" },
            {
              where: {
                ordered_by_group_name: group.group_name,
                ordered_by_company: group.created_by_company,
              },
            }
          );
        }
      }
      // Check if all orders for the group are completed
      const groupOrders = await Order.findAll({
        where: {
          ordered_by_group_name: group.group_name,
          ordered_by_company: group.created_by_company,
        },
      });

      const allOrdersCompleted = groupOrders.every(
        (order) => order.order_status === "completed"
      );

      if (allOrdersCompleted) {
        await Group.update(
          { group_status: "finished" },
          {
            where: {
              group_name: group.group_name,
              created_by_company: group.created_by_company,
            },
          }
        );
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
  // if (!task || !task.running) {
  //   task = cron.schedule("* * * * *", updateGroupDurations);
  //   console.log("<|-|>");
  // }
};

export { startTask };

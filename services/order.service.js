import { Menu, Order } from "../models/Schema.js";
import { fn, col, Op } from "sequelize";
import { CustomError } from "../utils/customError.js";
import httpStatusText from "../utils/STATUS.js";

export class OrderService {
  constructor(menuService) {
    this.menuService = menuService;
  }
  async create(orderData) {
    try {
      const order = await getOrder(orderData);
      if (order) {
        throw new CustomError("order alredy exists", 400, httpStatusText.ERROR);
      }

      const newOrder = await Order.create(orderData);

      return newOrder;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }
  async findOwner(id) {
    try {
      const order = await Order.findOne({
        where: { user_id: id },
      });
      if (!order) {
        throw new CustomError("order not found", 404, httpStatusText.NOT_FOUND);
      }
      return order;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }
  async findOne(orderData) {
    try {
      const {
        ordered_by_group_name,
        ordered_by_username,
        ordered_by_company,
        option,
        note,
      } = orderData;
      const order = await Order.findOne({
        where: {
          ordered_by_group_name,
          ordered_by_username,
          ordered_by_company,
          option,
          note,
        },
      });
      return order;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async update(orderData) {
    try {
      const {
        ordered_by_group_name,
        ordered_by_username,
        ordered_by_company,
        item_name,
        option,
        note,
      } = orderData;

      if (!orderData.cancel_msg) {
        orderData.cancel_msg = "";
      }
      console.log(orderData);
      const [updated] = await Order.update(orderData, {
        where: {
          ordered_by_group_name,
          ordered_by_username,
          ordered_by_company,
          item_name,
          option,
          note,
        },
      });
      console.log(updated);

      if (updated) {
        return "Order updated";
      }
      return "orders already updated";
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async find(orderData) {
    try {
      const { ordered_by_company, ordered_by_group_name } = orderData;

      let orders = await Order.findAll({
        where: {
          ordered_by_company,
          ordered_by_group_name,
          order_status: {
            [Op.notIn]: ["completed", "cancelled"],
          },
        },
        attributes: [
          "ordered_by_username",
          [fn("sum", col("quantity")), "total_quantity"],
          "item_name",
          "option",
          "note",
        ],
        group: ["ordered_by_username", "item_name", "option", "note"],
        order: [[fn("sum", col("quantity")), "DESC"]],
      });
      const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
          const plainOrder = order.get({ plain: true });

          const menuItem = await Menu.findOne({
            where: { item_name: plainOrder.item_name },
          });

          if (menuItem) {
            const matchedOption = menuItem.options.find(
              (opt) => opt.option === plainOrder.option
            );

            plainOrder.price = matchedOption ? matchedOption.price : 0;
          }

          return plainOrder;
        })
      );

      return enrichedOrders;
    } catch (error) {
      throw new Error(error.message, 400, httpStatusText.ERROR);
    }
  }

  async remove(orderData) {
    try {
      const {
        ordered_by_group_name,
        ordered_by_company,
        ordered_by_username,
        item_name,
        option,
        note,
      } = orderData;
      const order = await getOrder(orderData);

      if (!order) {
        throw new CustomError("Order not found", 404, httpStatusText.FAIL);
      }

      if (order.order_status === "running") {
        await Order.destroy({
          where: {
            ordered_by_group_name,
            ordered_by_company,
            ordered_by_username,
            item_name,
            option,
            note,
          },
        });
        return "delete done";
      }
      throw new CustomError("Can't delete order", 400, httpStatusText.ERROR);
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async findTotal(orderData) {
    try {
      const { ordered_by_group_name, ordered_by_company } = orderData;
      const orders = await Order.findAll({
        attributes: [
          [fn("sum", col("quantity")), "Tot"],
          "item_name",
          "option",
          "note",
        ],
        where: {
          ordered_by_company,
          ordered_by_group_name,
          order_status: {
            [Op.notIn]: ["completed", "cancelled"],
          },
        },
        group: ["item_name", "option", "note", "ordered_by_group_name"],
        order: [[fn("sum", col("quantity")), "DESC"]],
      });

      const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
          const plainOrder = order.get({ plain: true });

          const menuItem = await Menu.findOne({
            where: { item_name: plainOrder.item_name },
          });

          if (menuItem) {
            const matchedOption = menuItem.options.find(
              (opt) => opt.option === plainOrder.option
            );

            plainOrder.price = matchedOption ? matchedOption.price : 0;
          }

          return plainOrder;
        })
      );

      return enrichedOrders;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async findTotalByUser(orderData) {
    try {
      const { ordered_by_company, ordered_by_username } = orderData;

      let orders = await Order.findAll({
        where: {
          ordered_by_company,
          ordered_by_username,
          order_status: {
            [Op.notIn]: ["completed", "cancelled"],
          },
        },
      });

      const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
          const plainOrder = order.get({ plain: true });

          const menuItem = await Menu.findOne({
            where: { item_name: plainOrder.item_name },
          });

          if (menuItem) {
            const matchedOption = menuItem.options.find(
              (opt) => opt.option === plainOrder.option
            );

            plainOrder.price = matchedOption ? matchedOption.price : 0;
          }

          return plainOrder;
        })
      );

      return enrichedOrders;
    } catch (error) {
      throw new Error(error.message, 400, httpStatusText.ERROR);
    }
  }

  async notifyAsArrived(orderData) {
    try {
      const { ordered_by_group_name, ordered_by_company } = orderData;
      const [updated] = await Order.update(
        { order_status: "arrived" },
        {
          where: {
            ordered_by_group_name,
            ordered_by_company,
          },
        }
      );
      if (updated) {
        return "Orders updated.";
      }
      return "orders already arrived";
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async findCancelled(orderData) {
    try {
      const { ordered_by_group_name, ordered_by_username, ordered_by_company } =
        orderData;
      const order = await Order.findAll({
        attributes: ["item_name", "option", "note", "quantity", "cancel_msg"],
        where: {
          ordered_by_group_name,
          ordered_by_username,
          ordered_by_company,
          order_status: "cancelled",
        },
      });
      return order;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }
}

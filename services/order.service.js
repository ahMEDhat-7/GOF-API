import { GroupMember, Menu, Order, User } from "../models/Schema.js";
import { fn, col, Op, literal } from "sequelize";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class OrderService {
  constructor(menuService) {
    this.menuService = menuService;
  }
  async create(orderData) {
    try {
      const order = await this.findOne(orderData);
      if (order) {
        throw new CustomError("order alredy exists", 400, STATUS.ERROR);
      }

      const newOrder = await Order.create(orderData);

      return newOrder;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }
  async findOwner(id) {
    try {
      const order = await Order.findAll({
        where: { user_id: id },
      });

      return order;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }
  async findOne(orderData) {
    try {
      const { user_id, menu_item_id, options, note } = orderData;
      const order = await Order.findOne({
        where: {
          user_id,
          menu_item_id,
          options,
          note,
        },
      });
      return order;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
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
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async find(user_id) {
    try {
      let orders = await Order.findAll({
        where: {
          user_id,
          order_status: {
            [Op.notIn]: ["completed", "cancelled"],
          },
        },
        include: [
          {
            model: Menu,
            required: true,
            attributes: ["item_name"],
          },
        ],
        attributes: ["options", "note", "quantity"],
      });

      const flattenedOrders = orders.map((order) => ({
        item_name: order.Menu?.item_name,
        options: order.options,
        note: order.note,
        quantity: order.quantity,
      }));

      return flattenedOrders;
    } catch (error) {
      throw new Error(error.message, 400, STATUS.ERROR);
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
        throw new CustomError("Order not found", 404, STATUS.FAIL);
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
      throw new CustomError("Can't delete order", 400, STATUS.ERROR);
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  async findTotal(group_id) {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: Menu,
            required: true,
            attributes: [],
          },
        ],
        attributes: [
          [col("Menu.item_name"), "item_name"],
          [col("Order.options"), "options"],
          [col("Order.note"), "note"],
          [fn("sum", col("Order.quantity")), "total_quantity"],
        ],

        group: ["Menu.item_name", "options", "note"],
        order: [[fn("sum", col("quantity")), "DESC"]],
        where: {
          group_id,
          order_status: {
            [Op.notIn]: ["completed", "cancelled"],
          },
        },
      });

      return orders;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
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
      throw new Error(error.message, 400, STATUS.ERROR);
    }
  }

  async notifyAsArrived(user_id) {
    try {
      const [updated] = await Order.update(
        { order_status: "arrived" },
        {
          where: {
            group_id,
          },
        }
      );
      if (updated) {
        return "Orders updated.";
      }
      return "orders already arrived";
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
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
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }
}

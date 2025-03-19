import { Menu } from "../models/Schema.js";
import { CustomError } from "../utils/customError.js";
import httpStatusText from "../utils/STATUS.js";

export class MenuService {
  constructor() {}
  async create(menuDto) {
    try {
      const menu = await Menu.bulkCreate(menuDto);

      return menu;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async findByName(item_name) {
    try {
      const menu = await Menu.findOne({ where: { item_name } });
      return menu;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  /**
   *
   * @param {uuid} id
   * @returns {Menu[]} menu items
   */
  async find(id) {
    try {
      const menu = await Menu.findAll({
        where: id,
        attributes: ["id", "item_name", "options", "img"],
      });
      return menu;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async findOne(id) {
    try {
      const menus = await Menu.findOne({
        where: {
          id,
        },
        attributes: ["item_name", "options", "img"],
      });

      return menus;
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async update(menuData) {
    try {
      const { restaurant_name, item_name, options, img } = menuData;
      const [updated] = await Menu.update(
        { options, img },
        {
          where: { restaurant_name, item_name },
        }
      );
      if (updated) {
        const updatedMenu = await Menu.findOne({
          where: { restaurant_name, item_name },
        });
        return updatedMenu;
      }
      throw new CustomError("Menu item not found", 404, httpStatusText.FAIL);
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }

  async remove(restaurant_name, item_name) {
    try {
      const deleted = await Menu.destroy({
        where: { restaurant_name, item_name },
      });
      if (deleted) {
        return "Menu item deleted";
      }
      throw new CustomError("Menu item not found", 404, httpStatusText.FAIL);
    } catch (error) {
      throw new CustomError(error.message, 400, httpStatusText.ERROR);
    }
  }
}

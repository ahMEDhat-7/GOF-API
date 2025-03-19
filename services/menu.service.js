import { CreateMenuDTO, UpdatedMenuDTO } from "../dtos/menu.dto.js";
import { Menu } from "../models/Schema.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class MenuService {
  constructor() {}
  /**
   * Create a menu item
   * @param {CreateMenuDTO} menuDto - menu data transfer object
   * @returns {Menu} menu item
   */
  async create(menuDto) {
    try {
      const menu = await Menu.bulkCreate(menuDto);

      return menu;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  /**
   * Find a menu item by name
   * @param {string} item_name  - menu item
   * @returns {Menu} menu item
   */
  async findByName(item_name) {
    try {
      const menu = await Menu.findOne({ where: { item_name } });
      return menu;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  /**
   * Find all menu items
   * @param {uuid} restaurant_id
   * @returns {Menu[]} menu items
   */
  async find(restaurant_id) {
    try {
      const menu = await Menu.findAll({
        where: { restaurant_id },
        attributes: ["id", "item_name", "options", "img"],
      });
      return menu;
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  /**
   * Find a menu item by id
   * @param {uuid} id
   * @returns {Menu} menu item
   */
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
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  /**
   * Update a menu item by id
   * @param {uuid} id
   * @param {UpdatedMenuDTO} menuData
   * @returns {number} number of rows updated
   */
  async update(id, menuData) {
    try {
      const [updated] = await Menu.update(menuData, {
        where: { id },
      });
      if (updated > 0) return updated;

      throw new CustomError("Nothing updated", 204, STATUS.FAIL);
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }

  /**
   * Remove a menu item by id
   * @param {uuid} id
   * @returns {number} number of rows deleted
   */
  async remove(id) {
    try {
      const deleted = await Menu.destroy({
        where: { id },
      });
      if (deleted > 0) {
        return deleted;
      }
      throw new CustomError("Menu item not found", 404, STATUS.FAIL);
    } catch (error) {
      throw new CustomError(error.message, 400, STATUS.ERROR);
    }
  }
}

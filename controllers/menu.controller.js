import { CreateMenuDTO } from "../dtos/menu.dto.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { CustomError } from "../utils/customError.js";
import STATUS from "../utils/STATUS.js";

export class MenuController {
  constructor(menuService, restaurantService) {
    this.menuService = menuService;
    this.restaurantService = restaurantService;
  }
  create = asyncWrapper(async (req, res, next) => {
    try {
      const menuItems = req.body;
      menuItems.map((item) => {
        item.restaurant_id = req.params.restaurant_id;
      });
      console.log(menuItems);

      const newMenu = await this.menuService.create(menuItems);

      res
        .status(201)
        .json({ message: "Menu created.", status: STATUS.SUCCESS });
    } catch (error) {
      next(error);
    }
  });

  find = asyncWrapper(async (req, res, next) => {
    try {
      const id = req.params.id;
      console.log("id", id);

      const menu = await this.menuService.find(id);
      res.status(200).json("Menu found", menu);
    } catch (error) {
      next(error);
    }
  });

  update = asyncWrapper(async (req, res, next) => {
    try {
      const { restaurantId } = req.params;
      const updateData = req.body;
      const menuData = { ...req.body, ...req.params };
      const updatedMenu = await this.menuService.update(menuData);
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: updatedMenu,
      });
    } catch (error) {
      next(error);
    }
  });

  find = asyncWrapper(async (req, res, next) => {
    try {
      const menuData = req.params;
      const menus = await this.menuService.find(menuData);
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: menus,
      });
    } catch (error) {
      next(error);
    }
  });

  remove = asyncWrapper(async (req, res, next) => {
    try {
      const { restaurant_name, item_name } = req.params;
      const message = await this.menuService.remove(restaurant_name, item_name);
      res.status(200).json({
        status: STATUS.SUCCESS,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  });
}

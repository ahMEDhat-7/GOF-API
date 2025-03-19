import { UpdatedMenuDTO } from "../dtos/menu.dto.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
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
        item.restaurant_id = req.params.id;
        const rest = this.restaurantService.findOne(item.restaurant_id);
        if (!rest) {
          throw new CustomError("Restaurant Not Found", 404, STATUS.ERROR);
        }
      });
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
      const rest = await this.restaurantService.findOne(id);
      if (!rest) {
        throw new CustomError("Restaurant Not Found", 404, STATUS.ERROR);
      }
      const menu = await this.menuService.find(id);
      res
        .status(200)
        .json({ message: "Menu found", status: STATUS.SUCCESS, data: menu });
    } catch (error) {
      next(error);
    }
  });

  update = asyncWrapper(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { item_name, options, img } = req.body;
      const menuData = new UpdatedMenuDTO(item_name, options, img);
      const updatedMenu = await this.menuService.update(id, menuData);
      res.status(200).json({
        message: "Menu Updated",
        status: STATUS.SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  });

  remove = asyncWrapper(async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedItem = await this.menuService.remove(id);
      res.status(200).json({
        message: "Menu item deleted",
        status: STATUS.SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  });
}

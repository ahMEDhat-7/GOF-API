import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/dbConnect.config.js";

// Company Model
const Company = sequelize.define(
  "Company",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "Companies",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// User Model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    company_id: {
      type: DataTypes.UUID,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(11),
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "Users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Restaurant Model
const Restaurant = sequelize.define(
  "Restaurant",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    restaurant_name: {
      type: DataTypes.STRING(25),
      unique: true,
    },
    phone_number: {
      type: DataTypes.STRING(11),
    },
    img: {
      type: DataTypes.BLOB("medium"),
    },
    company_id: {
      type: DataTypes.UUID,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "Restaurants",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Group Model
const Group = sequelize.define(
  "Group",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    group_name: {
      type: DataTypes.STRING(100),
    },
    user_id: {
      type: DataTypes.UUID,
    },
    company_id: {
      type: DataTypes.UUID,
    },
    restaurant_id: {
      type: DataTypes.UUID,
    },
    group_status: {
      type: DataTypes.ENUM("running", "pending", "completed", "cancelled"),
      defaultValue: "running",
    },
    start_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "Groups",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// GroupMember Model
const GroupMember = sequelize.define(
  "GroupMember",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    group_id: {
      type: DataTypes.UUID,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    restaurant_id: {
      type: DataTypes.UUID,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "GroupMembers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Menu Model
const Menu = sequelize.define(
  "Menu",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    item_name: {
      type: DataTypes.STRING(50),
    },
    restaurant_id: {
      type: DataTypes.UUID,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    img: {
      type: DataTypes.BLOB("medium"),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "Menus",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["item_name", "restaurant_id"],
      },
    ],
  }
);

// Order Model
const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    group_member_id: {
      type: DataTypes.UUID,
    },
    menu_item_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    order_status: {
      type: DataTypes.ENUM("pending", "arrived", "completed", "cancelled"),
      defaultValue: "pending",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "Orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define relationships
Company.hasMany(User, {
  foreignKey: "company_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.belongsTo(Company, { foreignKey: "company_id" });

Company.hasMany(Restaurant, {
  foreignKey: "company_id",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Restaurant.belongsTo(Company, { foreignKey: "company_id" });

Restaurant.hasMany(Group, {
  foreignKey: "restaurant_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Group.belongsTo(Restaurant, { foreignKey: "restaurant_id" });

User.hasMany(Group, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Group.belongsTo(User, { foreignKey: "user_id" });

Group.hasMany(GroupMember, {
  foreignKey: "group_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
GroupMember.belongsTo(Group, { foreignKey: "group_id" });

User.hasMany(GroupMember, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
GroupMember.belongsTo(User, { foreignKey: "user_id" });

Restaurant.hasMany(GroupMember, {
  foreignKey: "restaurant_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
GroupMember.belongsTo(Restaurant, { foreignKey: "restaurant_id" });

Restaurant.hasMany(Menu, {
  foreignKey: "restaurant_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Menu.belongsTo(Restaurant, { foreignKey: "restaurant_id" });

Menu.hasMany(Order, {
  foreignKey: "menu_item_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Order.belongsTo(Menu, { foreignKey: "menu_item_id" });

GroupMember.hasMany(Order, {
  foreignKey: "group_member_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Order.belongsTo(GroupMember, { foreignKey: "group_member_id" });

export {
  sequelize,
  Company,
  User,
  Restaurant,
  Group,
  GroupMember,
  Menu,
  Order,
};

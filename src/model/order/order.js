const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");
const User = require("../user/user");

const Order = seq.define(
  "order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      comment: "用户id",
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "地址id",
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "订单总价",
    },
    order_number: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: "订单编号",
    },
    state: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "订单状态",
    },
    order_type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "订单类型 (1: 自提, 2: 外卖)",
    },
    pickup_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "取餐码",
    },
  },
  {
    timestamps: true, // 开启 Sequelize 自动添加的时间戳
    comment: "订单表",
    tableName: "orders",
  }
);

// // 地址和订单关系
// Address.hasMany(Order, { foreignKey: "address_id" });
// Order.belongsTo(Address, { foreignKey: "address_id" });

// // 用户和订单关联关系
// User.hasMany(Order, { foreignKey: "user_id" });
// Order.belongsTo(User, { foreignKey: "user_id" });

// // 订单与订单项关联关系
// Order.hasMany(OrderItem, { foreignKey: "order_id" });
// OrderItem.belongsTo(Order, { foreignKey: "order_id" });


module.exports = Order;

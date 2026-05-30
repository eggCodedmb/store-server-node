const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const Topping = seq.define(
  "topping",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "主键",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "加料名称（如：珍珠、椰果、布丁）",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "价格",
    },
  },
  {
    timestamps: true,
    tableName: "topping",
    comment: "加料表",
    paranoid: true,
  }
);

module.exports = Topping;

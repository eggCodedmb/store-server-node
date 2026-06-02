const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const SpecOption = seq.define(
  "spec_option",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "主键",
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "所属规格组ID",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "选项名（如：大杯、去冰、七分甜）",
    },
    price_delta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "价格增量（如大杯 +3元，去冰 +0元）",
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "是否默认选中: true-是, false-否",
    },
  },
  {
    timestamps: true,
    tableName: "spec_option",
    comment: "规格选项表",
    paranoid: true,
  }
);

module.exports = SpecOption;

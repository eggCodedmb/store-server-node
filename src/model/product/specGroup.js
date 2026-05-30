const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const SpecGroup = seq.define(
  "spec_group",
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
      comment: "规格名（如：杯型、温度、甜度）",
    },
  },
  {
    timestamps: true,
    tableName: "spec_group",
    comment: "规格组表",
    paranoid: true,
  }
);

module.exports = SpecGroup;

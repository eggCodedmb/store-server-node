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
    select_type: {
      type: DataTypes.ENUM("single", "multiple"),
      allowNull: false,
      defaultValue: "single",
      comment: "选择模式: single-单选, multiple-多选",
    },
    is_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "是否必选: true-是, false-否",
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

const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");
const User = require("../user/user");
const Address = seq.define(
  "address",
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
      comment: "用户ID",
    },
    consignee: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "收货人姓名",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "电话号码",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "地址",
    },
    area_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "所在地区名称",
    },
    area_code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "所在地区代码",
    },
    tag: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "标签（0：家、1：公司、2：学校）",
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "是否为默认地址",
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
    comment: "用户地址表", // 表的注释,
    tableName: "addresses",
  }
);

module.exports = Address;

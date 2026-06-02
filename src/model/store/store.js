const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const Store = seq.define(
  "store",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "所属商家(用户)ID",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "门店名称",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "门店描述",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "门店地址",
    },
    business_hours: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "营业时间(例如: 08:00-22:00)",
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
      comment: "经度",
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
      comment: "纬度",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "联系电话",
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "门店Logo",
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "门店封面图",
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "门店状态(1=营业中, 0=已关闭)",
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "省",
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "市",
    },
    district: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "区/县",
    },
  },
  {
    timestamps: true,
    comment: "门店表",
    tableName: "stores",
  }
);

module.exports = Store;

const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const Goods = seq.define(
  "goods",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    goods_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      Comment: "商品名称",
    },
    goods_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0,
      },
      Comment: "商品价格",
    },
    goods_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
      Comment: "商品数量",
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "所属门店ID",
    },
    goods_img: {
      type: DataTypes.STRING,
      allowNull: true, // 图片可以为空
      Comment: "商品图片",
    },
    goods_detail: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "商品详情介绍",
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "商品状态 1-上架中 0-已下架",
    },
  },
  {
    timestamps: true, // 自动添加createdAt和updatedAt字段
    comment: "商品表", // 表的注释
    tableName: "goods",
    paranoid: false, // 关闭软删除，DB中没有deletedAt
  }
);

module.exports = Goods;

const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const Banner = seq.define(
  "Banner",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Banner标题",
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "图片地址",
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "排序 (升序)",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "状态 (true: 启用, false: 禁用)",
    },
    link_path: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "跳转路径 (例如 /pages/menu/menu)",
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "所属门店ID (NULL 表示全局通用 Banner)",
    },
  },
  {
    timestamps: true,
    comment: "系统轮播图表",
    tableName: "banners",
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

module.exports = Banner;

const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const Notice = seq.define(
  "Notice",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "公告标题",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "公告内容",
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "公告类型 (1: 通知, 2: 公告, 3: 活动)",
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "状态 (true: 发布, false: 隐藏)",
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "发布者",
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "公告图标",
    },
  },
  {
    timestamps: true,
    comment: "系统公告表",
    tableName: "notices",
  }
);

module.exports = Notice;

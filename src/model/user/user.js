const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");
//创建模型
const User = seq.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nick_name: {
      type: DataTypes.STRING,
      //是否为空
      allowNull: false,
      comment: "昵称",
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "头像",
    },
    email: {
      type: DataTypes.STRING,
      //是否为空
      allowNull: false,
      comment: "邮箱",
    },
    user_name: {
      type: DataTypes.STRING,
      //是否为空
      allowNull: false,
      unique: true,
      comment: "用户名,唯一",
    },
    password: {
      type: DataTypes.CHAR(64),
      allowNull: false,
      comment: "密码",
    },
    openid: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: "微信小程序openid",
    },
    unionid: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: "微信unionid",
    },
  },
  {
    timestamps: true, // 关闭 Sequelize 自动添加的时间戳
    comment: "用户表",
    tableName: "users",
  }
);

module.exports = User;

const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const Permission = seq.define(
  "Permission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "权限名称",
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "权限编码（如 user:add）",
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "权限类型（1: 菜单, 2: 按钮, 3: 接口）",
    },
    path: {
      type: DataTypes.STRING,
      comment: "路由路径或接口路径",
    },
    method: {
      type: DataTypes.STRING,
      comment: "请求方法（GET/POST等，仅接口类型有效）",
    },
    parent_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "父权限ID",
    },
  },
  {
    tableName: "rbac_permissions",
    timestamps: true,
  }
);

module.exports = Permission;

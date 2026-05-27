const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const Role = seq.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "角色名称",
    },
    role_key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "角色权限字符串",
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "角色状态（true正常 false停用）",
    },
    remark: {
      type: DataTypes.STRING,
      comment: "备注",
    },
  },
  {
    tableName: "rbac_roles",
    timestamps: true,
  }
);

module.exports = Role;

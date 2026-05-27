const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const UserRole = seq.define("UserRole", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'rbac_roles',
      key: 'id'
    }
  }
}, { tableName: "rbac_user_roles", timestamps: false });

const RolePermission = seq.define("RolePermission", {
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'rbac_roles',
      key: 'id'
    }
  },
  permissionId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'rbac_permissions',
      key: 'id'
    }
  }
}, { tableName: "rbac_role_permissions", timestamps: false });

module.exports = { UserRole, RolePermission };

const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const UserStore = seq.define(
  "UserStore",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      comment: "用户ID",
    },
    storeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      comment: "门店ID",
    },
  },
  {
    tableName: "user_stores",
    timestamps: true,
  }
);

module.exports = UserStore;

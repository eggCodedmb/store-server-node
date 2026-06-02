const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const StorePhoto = seq.define(
  "store_photo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "所属门店ID",
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "图片URL",
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "排序",
    },
  },
  {
    timestamps: true,
    comment: "门店照片表",
    tableName: "store_photos",
  }
);

module.exports = StorePhoto;

const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const ProductSpecRel = seq.define(
  "product_spec_rel",
  {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "商品ID",
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "规格组ID",
    },
  },
  {
    timestamps: true,
    tableName: "product_spec_rel",
    comment: "商品-规格关联表",
  }
);

module.exports = ProductSpecRel;

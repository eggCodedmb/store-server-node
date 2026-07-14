const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const UserCoupon = seq.define(
  "user_coupon",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "领取用户 id",
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "关联优惠券模板 id",
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "使用的订单 id（null = 未使用）",
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      comment: "状态 (0: 未使用, 1: 已使用, 2: 已过期)",
    },
    claimed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: "领取时间",
    },
    used_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "使用时间",
    },
  },
  {
    timestamps: true,
    comment: "用户优惠券表",
    tableName: "user_coupons",
  }
);

module.exports = UserCoupon;

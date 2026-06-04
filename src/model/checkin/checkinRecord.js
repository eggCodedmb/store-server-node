const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const CheckinRecord = seq.define(
  "checkin_record",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "签到用户 id",
    },
    checkin_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "签到日期",
    },
    day_number: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "签到周期中的天数 (1-7)",
    },
    streak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "连续签到天数",
    },
    coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "奖励的用户优惠券 id（null = 无奖励）",
    },
  },
  {
    timestamps: true,
    comment: "用户签到记录表",
    tableName: "checkin_records",
    indexes: [
      {
        unique: true,
        fields: ["user_id", "checkin_date"],
        name: "uk_user_date",
      },
      {
        fields: ["user_id", "streak"],
        name: "idx_user_streak",
      },
    ],
  }
);

module.exports = CheckinRecord;

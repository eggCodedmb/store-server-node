const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const CheckinReward = seq.define(
  "checkin_reward",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    day_number: {
      type: DataTypes.TINYINT,
      allowNull: false,
      unique: true,
      comment: "签到周期天数 (1-7)",
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "关联优惠券模板 id",
    },
  },
  {
    timestamps: true,
    comment: "签到奖励配置表",
    tableName: "checkin_rewards",
  }
);

module.exports = CheckinReward;

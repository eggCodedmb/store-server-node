const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const CouponTemplate = seq.define(
  "coupon_template",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "优惠券名称，如'满50减10'",
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "优惠券类型 (1: 满减券, 2: 折扣券, 3: 固定金额券)",
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "面值：满减金额 / 折扣比例(如0.85) / 固定减免金额",
    },
    min_spend: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      comment: "最低消费门槛",
    },
    max_discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "折扣券最大优惠金额（封顶），null 表示不限",
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "关联门店，null = 平台通用券",
    },
    total_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "总发放数量，-1 表示不限量",
    },
    claimed_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "已领取数量",
    },
    per_user_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: "每人限领数量",
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "有效期开始",
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "有效期结束",
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: "状态 (1: 启用, 0: 停用)",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "创建者 user_id",
    },
  },
  {
    timestamps: true,
    comment: "优惠券模板表",
    tableName: "coupon_templates",
  }
);

module.exports = CouponTemplate;

// 优惠券模板创建/更新校验规则
module.exports = {
  // 创建优惠券模板
  createCouponTemplateRules: {
    name: {
      type: "string",
      required: true,
      max: 100,
      description: "优惠券名称，必填",
    },
    type: {
      type: "integer",
      required: true,
      enum: [1, 2, 3],
      description: "优惠券类型 (1: 满减券, 2: 折扣券, 3: 固定金额券)",
    },
    value: {
      type: "number",
      required: true,
      min: 0.01,
      description: "面值，必须大于 0",
    },
    min_spend: {
      type: "number",
      required: false,
      min: 0,
      description: "最低消费门槛",
    },
    max_discount: {
      type: "number",
      required: false,
      min: 0,
      description: "折扣券最大优惠金额（封顶）",
    },
    store_id: {
      type: "integer",
      required: false,
      description: "关联门店 ID，不传为平台通用券",
    },
    total_count: {
      type: "integer",
      required: true,
      min: -1,
      description: "总发放数量，-1 表示不限量",
    },
    per_user_limit: {
      type: "integer",
      required: false,
      min: 1,
      default: 1,
      description: "每人限领数量",
    },
    start_time: {
      type: "string",
      required: true,
      description: "有效期开始时间",
    },
    end_time: {
      type: "string",
      required: true,
      description: "有效期结束时间",
    },
  },

  // 更新优惠券模板
  updateCouponTemplateRules: {
    name: {
      type: "string",
      required: false,
      max: 100,
    },
    type: {
      type: "integer",
      required: false,
      enum: [1, 2, 3],
    },
    value: {
      type: "number",
      required: false,
      min: 0.01,
    },
    min_spend: {
      type: "number",
      required: false,
      min: 0,
    },
    max_discount: {
      type: "number",
      required: false,
      min: 0,
    },
    total_count: {
      type: "integer",
      required: false,
      min: -1,
    },
    per_user_limit: {
      type: "integer",
      required: false,
      min: 1,
    },
    start_time: {
      type: "string",
      required: false,
    },
    end_time: {
      type: "string",
      required: false,
    },
    status: {
      type: "integer",
      required: false,
      enum: [0, 1],
    },
  },

  // 查询我的优惠券
  myCouponRules: {
    status: {
      type: "integer",
      required: false,
      enum: [0, 1, 2],
      description: "优惠券状态筛选 (0: 未使用, 1: 已使用, 2: 已过期)",
    },
  },

  // 预览优惠券价格
  couponPreviewRules: {
    coupon_id: {
      type: "integer",
      required: true,
      description: "用户优惠券 ID（user_coupons 表）",
    },
    items: {
      type: "array",
      itemType: "object",
      rule: {
        goods_id: { type: "integer", required: true },
        spec_ids: { type: "array", required: false, itemType: "integer" },
        quantity: { type: "integer", required: true, min: 1 },
      },
      required: true,
      description: "订单商品列表",
    },
    store_id: {
      type: "integer",
      required: false,
      description: "门店 ID，用于门店券校验",
    },
  },
};

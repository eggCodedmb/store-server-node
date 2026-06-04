// 签到校验规则
module.exports = {
  // 更新签到奖励配置
  updateCheckinRewardsRules: {
    rewards: {
      type: "array",
      itemType: "object",
      rule: {
        day_number: {
          type: "integer",
          required: true,
          min: 1,
          max: 7,
          description: "签到天数 (1-7)",
        },
        template_id: {
          type: "integer",
          required: true,
          min: 1,
          description: "优惠券模板 ID",
        },
      },
      required: true,
      description: "签到奖励配置数组，每项含 day_number(1-7) 和 template_id",
    },
  },
};

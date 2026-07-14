const CouponTemplate = require("../model/coupon/couponTemplate");

const seedCoupons = async () => {
  try {
    console.log("开始生成积分商城优惠券模板...");

    const startTime = new Date();
    const endTime = new Date();
    endTime.setFullYear(startTime.getFullYear() + 2); // 有效期为 2 年

    const templates = [
      {
        name: "满10减5",
        type: 1, // 满减券
        value: 5.00,
        min_spend: 10.00,
        total_count: -1, // 不限量
        per_user_limit: 10, // 每人限领 10 张
        start_time: startTime,
        end_time: endTime,
        status: 1
      },
      {
        name: "满5减3",
        type: 1, // 满减券
        value: 3.00,
        min_spend: 5.00,
        total_count: -1,
        per_user_limit: 10,
        start_time: startTime,
        end_time: endTime,
        status: 1
      },
      {
        name: "满3减3",
        type: 1, // 满减券
        value: 3.00,
        min_spend: 3.00,
        total_count: -1,
        per_user_limit: 10,
        start_time: startTime,
        end_time: endTime,
        status: 1
      },
      {
        name: "满20减3",
        type: 1, // 满减券
        value: 3.00,
        min_spend: 20.00,
        total_count: -1,
        per_user_limit: 10,
        start_time: startTime,
        end_time: endTime,
        status: 1
      }
    ];

    for (const temp of templates) {
      // 检查是否已存在同名模板
      const [existing, created] = await CouponTemplate.findOrCreate({
        where: { name: temp.name },
        defaults: temp
      });
      if (created) {
        console.log(`成功创建优惠券模板: ${temp.name} (面额: ￥${temp.value}, 门槛: ￥${temp.min_spend})`);
      } else {
        console.log(`优惠券模板已存在: ${temp.name}，无需重复创建`);
      }
    }

    console.log("优惠券模板生成完毕！");
    process.exit(0);
  } catch (error) {
    console.error("生成优惠券模板失败:", error);
    process.exit(1);
  }
};

seedCoupons();

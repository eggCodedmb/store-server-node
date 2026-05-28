const User = require("../../model/user/user");
const Goods = require("../../model/product/goods");
const Order = require("../../model/order/order");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

class statisticsService {
  /**
   *查询用户的总数
   * @param {date} starDate -- "2024-09-01"
   * @param {date} endDate -- "2024-09-30"
   * @returns
   */
  async userCount(starDate = "2024-01-01", endDate = "2024-12-31") {
    const res = await User.count({
      where: {
        createdAt: {
          [Op.between]: [starDate, endDate],
        },
      },
    });
    return res || 0;
  }
  async goodsCount(starDate = "2024-01-01", endDate = "2024-12-31") {
    const res = await Goods.count({
      where: {
        createdAt: {
          [Op.between]: [starDate, endDate],
        },
      },
    });
    return res || 0;
  }

  async orderCount(starDate = "2024-01-01", endDate = "2024-12-31") {
    const res = await Order.count({
      where: {
        createdAt: {
          [Op.between]: [starDate, endDate],
        },
      },
    });
    return res || 0;
  }

  /**
   * 获取概览统计数据
   * 包括：总商品数、今日订单、活跃用户、月销售额
   */
  async getSummary() {
    const todayStart = dayjs().startOf("day").toDate();
    const monthStart = dayjs().startOf("month").toDate();
    const activeStart = dayjs().subtract(30, "day").toDate();

    const [totalGoods, todayOrders, activeUsers, monthlySales] = await Promise.all([
      Goods.count(),
      Order.count({
        where: {
          createdAt: { [Op.gte]: todayStart }
        }
      }),
      User.count({
        where: {
          updatedAt: { [Op.gte]: activeStart }
        }
      }),
      Order.sum("total_price", {
        where: {
          createdAt: { [Op.gte]: monthStart }
        }
      })
    ]);

    return {
      totalGoods: totalGoods || 0,
      todayOrders: todayOrders || 0,
      activeUsers: activeUsers || 0,
      monthlySales: parseFloat(monthlySales || 0).toFixed(2)
    };
  }
}

module.exports = new statisticsService();

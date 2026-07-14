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
   * 计算百分比变化趋势
   * @param {number} current - 本期数值
   * @param {number} last - 上期数值
   * @returns {number} 百分比变化，保留一位小数
   */
  _calcTrend(current, last) {
    if (last === 0) return current > 0 ? 100 : 0;
    return parseFloat((((current - last) / last) * 100).toFixed(1));
  }

  /**
   * 获取概览统计数据（含趋势百分比）
   * 包括：总商品数、今日订单、活跃用户、月销售额 及各自较上周的趋势
   */
  async getSummary() {
    const now = dayjs();
    const todayStart = now.startOf("day").toDate();
    const yesterdayStart = now.subtract(1, "day").startOf("day").toDate();
    const yesterdayEnd = now.subtract(1, "day").endOf("day").toDate();
    const monthStart = now.startOf("month").toDate();
    const lastWeekStart = now.subtract(7, "day").startOf("day").toDate();
    const lastWeekEnd = now.subtract(1, "day").endOf("day").toDate();
    const lastMonthStart = now.subtract(1, "month").startOf("month").toDate();
    const lastMonthEnd = now.subtract(1, "month").endOf("month").toDate();
    const activeStart = now.subtract(30, "day").toDate();
    const lastWeekActiveStart = now.subtract(37, "day").toDate();

    const [
      totalGoods, todayOrders, activeUsers, monthlySales,
      lastWeekGoods, lastWeekOrderCount, lastWeekActiveUsers, lastMonthSales
    ] = await Promise.all([
      Goods.count(),
      Order.count({ where: { createdAt: { [Op.gte]: todayStart } } }),
      User.count({ where: { updatedAt: { [Op.gte]: activeStart } } }),
      Order.sum("total_price", { where: { createdAt: { [Op.gte]: monthStart } } }),
      // 上周同期数据（过去7天 vs 前7天）
      Goods.count({ where: { createdAt: { [Op.between]: [lastWeekStart, lastWeekEnd] } } }),
      Order.count({ where: { createdAt: { [Op.between]: [lastWeekStart, lastWeekEnd] } } }),
      User.count({ where: { updatedAt: { [Op.between]: [lastWeekActiveStart, lastWeekStart] } } }),
      Order.sum("total_price", { where: { createdAt: { [Op.between]: [lastMonthStart, lastMonthEnd] } } }),
    ]);

    return {
      totalGoods: totalGoods || 0,
      todayOrders: todayOrders || 0,
      activeUsers: activeUsers || 0,
      monthlySales: parseFloat(monthlySales || 0).toFixed(2),
      trends: {
        totalGoods: this._calcTrend(totalGoods || 0, lastWeekGoods || 0),
        todayOrders: this._calcTrend(todayOrders || 0, lastWeekOrderCount || 0),
        activeUsers: this._calcTrend(activeUsers || 0, lastWeekActiveUsers || 0),
        monthlySales: this._calcTrend(parseFloat(monthlySales || 0), parseFloat(lastMonthSales || 0)),
      }
    };
  }

  /**
   * 获取最近订单列表
   * @param {number} limit - 返回条数，默认5
   */
  async getRecentOrders(limit = 5) {
    const User = require("../../model/user/user");
    const orders = await Order.findAll({
      attributes: ["id", "order_number", "total_price", "state", "createdAt"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nick_name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    });

    const stateMap = {
      0: "待支付",
      1: "已支付",
      2: "待发货",
      3: "已发货",
      4: "已收货",
      5: "已完成",
      6: "已取消",
    };

    return orders.map((order) => ({
      orderId: order.order_number,
      customer: order.user ? order.user.nick_name : "未知用户",
      amount: parseFloat(order.total_price),
      status: stateMap[order.state] || "未知",
      time: dayjs(order.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    }));
  }

  /**
   * 获取销售趋势数据
   * @param {number} days - 统计的天数
   */
  async getSalesTrend(days = 7) {
    const results = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
      const start = dayjs(date).startOf("day").toDate();
      const end = dayjs(date).endOf("day").toDate();

      const [orderCount, salesAmount] = await Promise.all([
        Order.count({
          where: {
            createdAt: { [Op.between]: [start, end] }
          }
        }),
        Order.sum("total_price", {
          where: {
            createdAt: { [Op.between]: [start, end] }
          }
        })
      ]);

      results.push({
        date,
        orders: orderCount || 0,
        sales: parseFloat(salesAmount || 0).toFixed(2)
      });
    }
    return results;
  }

  /**
   * 获取商品分类分布数据
   */
  async getCategoryDistribution() {
    const Category = require("../../model/product/category");
    const categories = await Category.findAll({
      attributes: ["id", "category_name"],
      include: [
        {
          model: Goods,
          attributes: ["id"],
          through: { attributes: [] }
        }
      ]
    });

    return categories.map(cat => ({
      name: cat.category_name,
      value: cat.goods.length
    }));
  }
}


module.exports = new statisticsService();

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

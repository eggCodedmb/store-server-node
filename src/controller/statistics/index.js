const statisticsService = require("../../service/statistics");
class statisticsController {
  /**
   * 获取用户统计数据
   * @param {Object} ctx - Koa 的上下文对象，包含请求和响应信息
   * @returns {Promise<void>}
   */
  async getUserStatistics(ctx) {
    const { starDate, endDate } = ctx.request.body;
    const res = await statisticsService.userCount(starDate, endDate);
    ctx.body = {
      code: 0,
      message: "获取用户统计数据成功",
      result: res,
    };
  }
  // 商品总数
  async getGoodsStatistics(ctx) {
    // 开始统计时间和结束统计时间
    const { starDate, endDate } = ctx.request.body;
    const res = await statisticsService.goodsCount(starDate, endDate);
    ctx.body = {
      code: 0,
      message: "获取商品统计数据成功",
      result: res,
    };
  }

  // 订单量
  async getOrderStatistics(ctx) {
    // 开始统计时间和结束统计时间
    const { starDate, endDate } = ctx.request.body;
    const res = await statisticsService.orderCount(starDate, endDate);
    ctx.body = {
      code: 0,
      message: "获取订单统计数据成功",
      result: res,
    };
  }

  /**
   * 获取首页概览统计数据
   */
  async getSummaryStatistics(ctx) {
    try {
      const res = await statisticsService.getSummary();
      ctx.body = {
        code: 0,
        message: "获取概览统计数据成功",
        result: res,
      };
    } catch (err) {
      console.error("getSummaryStatistics error:", err);
      ctx.body = {
        code: 10001,
        message: "获取概览统计数据失败: " + err.message,
      };
    }
  }

  // 销售趋势
  async getSalesTrend(ctx) {
    const { days = 7 } = ctx.query;
    const res = await statisticsService.getSalesTrend(parseInt(days));
    ctx.body = {
      code: 0,
      message: "获取销售趋势数据成功",
      result: res,
    };
  }

  // 分类分布
  async getCategoryDistribution(ctx) {
    const res = await statisticsService.getCategoryDistribution();
    ctx.body = {
      code: 0,
      message: "获取分类分布数据成功",
      result: res,
    };
  }

  // 最近订单
  async getRecentOrders(ctx) {
    const { limit = 5 } = ctx.query;
    const res = await statisticsService.getRecentOrders(parseInt(limit));
    ctx.body = {
      code: 0,
      message: "获取最近订单成功",
      result: res,
    };
  }
}


module.exports = new statisticsController();

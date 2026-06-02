const Router = require("koa-router");
const { auth } = require("../middleware/authMiddleware");
const {
  getUserStatistics,
  getGoodsStatistics,
  getOrderStatistics,
  getSummaryStatistics,
  getSalesTrend,
  getCategoryDistribution,
  getRecentOrders,
} = require("../controller/statistics");

const router = new Router({ prefix: "/tj" });

// Dashboard 统计接口仅需登录验证（Dashboard 是所有登录用户的基础页面）
// 概览统计数据
router.get("/summary", auth, getSummaryStatistics);
// 销售趋势
router.get("/sales-trend", auth, getSalesTrend);
// 分类分布
router.get("/category-distribution", auth, getCategoryDistribution);
// 最近订单
router.get("/recent-orders", auth, getRecentOrders);

router.post("/user-count", auth, getUserStatistics);
router.post("/goods-count", auth, getGoodsStatistics);
router.post("/order-count", auth, getOrderStatistics);
module.exports = router;

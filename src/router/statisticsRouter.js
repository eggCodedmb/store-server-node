const Router = require("koa-router");
const { auth, authorize } = require("../middleware/authMiddleware");
const {
  getUserStatistics,
  getGoodsStatistics,
  getOrderStatistics,
  getSummaryStatistics,
  getSalesTrend,
  getCategoryDistribution,
} = require("../controller/statistics");

const router = new Router({ prefix: "/tj" });

// 概览统计数据
router.get("/summary", auth, authorize(), getSummaryStatistics);

// 销售趋势
router.get("/sales-trend", auth, authorize(), getSalesTrend);
// 分类分布
router.get("/category-distribution", auth, authorize(), getCategoryDistribution);


router.post("/user-count", auth, authorize(), getUserStatistics);
router.post("/goods-count", auth, authorize(), getGoodsStatistics);
router.post("/order-count", auth, authorize(), getOrderStatistics);
module.exports = router;

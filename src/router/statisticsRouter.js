const Router = require("koa-router");
const { auth, authorize } = require("../middleware/authMiddleware");
const {
  getUserStatistics,
  getGoodsStatistics,
  getOrderStatistics,
  getSummaryStatistics,
} = require("../controller/statistics");

const router = new Router({ prefix: "/tj" });

// 概览统计数据
router.get("/summary", auth, authorize(), getSummaryStatistics);

router.post("/user-count", auth, authorize(), getUserStatistics);
router.post("/goods-count", auth, authorize(), getGoodsStatistics);
router.post("/order-count", auth, authorize(), getOrderStatistics);
module.exports = router;

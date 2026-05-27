const Router = require("koa-router");
const { auth, authorize } = require("../middleware/authMiddleware");
const {
  getUserStatistics,
  getGoodsStatistics,
  getOrderStatistics,
} = require("../controller/statistics");

const router = new Router({ prefix: "/tj" });

router.post("/user-count", auth, authorize(), getUserStatistics);
router.post("/goods-count", auth, authorize(), getGoodsStatistics);
router.post("/order-count", auth, authorize(), getOrderStatistics);
module.exports = router;

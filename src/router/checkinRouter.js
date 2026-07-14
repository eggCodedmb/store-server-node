const Router = require("koa-router");
const { auth, authorize } = require("../middleware/authMiddleware");
const { validateParams } = require("../middleware/genericMiddleware");
const {
  getStatus,
  doCheckin,
  getRewards,
  updateRewards,
  getRecords,
} = require("../controller/checkinController");
const { updateCheckinRewardsRules } = require("../constant/checkinRules");
const { checkinFormError } = require("../constant/errType");

const router = new Router({ prefix: "/checkin" });

// ========== 小程序端（用户） ==========

// 获取签到状态
router.get("/status", auth, getStatus);

// 执行签到
router.post("/", auth, doCheckin);

// ========== 管理端（门店老板/管理员） ==========

// 查询签到奖励配置
router.get(
  "/rewards",
  auth,
  authorize("/checkin/rewards", "GET"),
  getRewards
);

// 更新签到奖励配置
router.put(
  "/rewards",
  validateParams(updateCheckinRewardsRules, checkinFormError),
  auth,
  authorize("/checkin/rewards", "PUT"),
  updateRewards
);

// 查询签到记录
router.get(
  "/records",
  auth,
  authorize("/checkin/records", "GET"),
  getRecords
);

module.exports = router;

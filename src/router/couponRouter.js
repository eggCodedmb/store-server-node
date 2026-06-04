const Router = require("koa-router");
const { auth, authorize } = require("../middleware/authMiddleware");
const { validateParams } = require("../middleware/genericMiddleware");
const { verifyStoreOwnership } = require("../middleware/storeMiddleware");
const {
  createTemplate,
  updateTemplate,
  getTemplateList,
  getTemplateDetail,
  disableTemplate,
  getTemplateRecords,
  getAvailableCoupons,
  claimCoupon,
  getMyCoupons,
  previewCoupon,
} = require("../controller/couponController");
const {
  createCouponTemplateRules,
  updateCouponTemplateRules,
  myCouponRules,
  couponPreviewRules,
} = require("../constant/couponRules");
const { couponFormError } = require("../constant/errType");

const router = new Router({ prefix: "/coupon" });

// ========== 小程序端（用户） ==========

// 获取可领取的优惠券列表
router.get("/available", auth, getAvailableCoupons);

// 领取优惠券
router.post(
  "/claim/:id",
  validateParams({ id: { type: "integer", required: true } }, couponFormError),
  auth,
  claimCoupon
);

// 查询我的优惠券
router.get("/mine", auth, getMyCoupons);

// 预览使用优惠券后的价格
router.post(
  "/preview",
  validateParams(couponPreviewRules, couponFormError),
  auth,
  previewCoupon
);

// ========== 管理端（门店老板/管理员） ==========

// 查询优惠券模板列表
router.get(
  "/template",
  auth,
  authorize("/coupon/template", "GET"),
  getTemplateList
);

// 查询单个模板详情
router.get(
  "/template/:id",
  validateParams({ id: { type: "integer", required: true } }, couponFormError),
  auth,
  getTemplateDetail
);

// 创建优惠券模板
router.post(
  "/template",
  validateParams(createCouponTemplateRules, couponFormError),
  auth,
  authorize("/coupon/template", "POST"),
  verifyStoreOwnership,
  createTemplate
);

// 更新优惠券模板
router.put(
  "/template/:id",
  validateParams(
    { id: { type: "integer", required: true }, ...updateCouponTemplateRules },
    couponFormError
  ),
  auth,
  authorize("/coupon/template/:id", "PUT"),
  updateTemplate
);

// 停用优惠券模板
router.delete(
  "/template/:id",
  validateParams({ id: { type: "integer", required: true } }, couponFormError),
  auth,
  authorize("/coupon/template/:id", "DELETE"),
  disableTemplate
);

// 查看某模板的领取/使用记录
router.get(
  "/template/:id/records",
  validateParams({ id: { type: "integer", required: true } }, couponFormError),
  auth,
  authorize("/coupon/template/:id/records", "GET"),
  getTemplateRecords
);

module.exports = router;

const couponService = require("../service/couponService");
const {
  couponFormError,
  couponNotFoundError,
  couponTemplateError,
} = require("../constant/errType");

class CouponController {
  /**
   * 创建优惠券模板（门店老板/管理员）
   */
  async createTemplate(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const data = ctx.request.body;
      const res = await couponService.createTemplate(data, user_id);
      ctx.body = { code: 0, message: "优惠券创建成功", result: res };
    } catch (error) {
      console.error(error);
      couponTemplateError.message = error.message;
      ctx.app.emit("error", couponTemplateError, ctx);
    }
  }

  /**
   * 更新优惠券模板
   */
  async updateTemplate(ctx) {
    try {
      const { id } = ctx.params;
      const data = ctx.request.body;
      const res = await couponService.updateTemplate(id, data);
      ctx.body = { code: 0, message: "优惠券更新成功", result: res };
    } catch (error) {
      console.error(error);
      couponFormError.message = error.message;
      ctx.app.emit("error", couponFormError, ctx);
    }
  }

  /**
   * 查询优惠券模板列表（管理端）
   */
  async getTemplateList(ctx) {
    try {
      const { pageNum, pageSize, store_id, status, type } = ctx.query;
      const res = await couponService.findTemplates({ store_id, status, type }, pageNum, pageSize);
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: error.message };
    }
  }

  /**
   * 查询单个模板详情
   */
  async getTemplateDetail(ctx) {
    try {
      const { id } = ctx.params;
      const res = await couponService.findTemplateById(id);
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.error(error);
      couponNotFoundError.message = error.message;
      ctx.app.emit("error", couponNotFoundError, ctx);
    }
  }

  /**
   * 停用优惠券模板
   */
  async disableTemplate(ctx) {
    try {
      const { id } = ctx.params;
      const res = await couponService.updateTemplate(id, { status: 0 });
      ctx.body = { code: 0, message: "优惠券已停用", result: res };
    } catch (error) {
      console.error(error);
      couponFormError.message = error.message;
      ctx.app.emit("error", couponFormError, ctx);
    }
  }

  /**
   * 查看某模板的领取/使用记录
   */
  async getTemplateRecords(ctx) {
    try {
      const { id } = ctx.params;
      const { pageNum, pageSize } = ctx.query;
      const res = await couponService.getTemplateRecords(id, pageNum, pageSize);
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: error.message };
    }
  }

  /**
   * 获取用户可领取的优惠券列表
   */
  async getAvailableCoupons(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const { store_id, pageNum, pageSize } = ctx.query;
      const res = await couponService.getAvailableCoupons(user_id, store_id, pageNum, pageSize);
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: error.message };
    }
  }

  /**
   * 领取优惠券
   */
  async claimCoupon(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const { id } = ctx.params; // template_id
      const res = await couponService.claimCoupon(id, user_id);
      ctx.body = { code: 0, message: "领取成功", result: res };
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: error.message };
    }
  }

  /**
   * 查询我的优惠券
   */
  async getMyCoupons(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const { status, pageNum, pageSize } = ctx.query;
      const res = await couponService.getUserCoupons(user_id, status, pageNum, pageSize);
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: error.message };
    }
  }

  /**
   * 预览订单使用优惠券后的价格
   */
  async previewCoupon(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const { coupon_id, items, store_id } = ctx.request.body;

      // 先计算原价
      const settlementService = require("../service/settlementService");
      const couponInfo = { coupon_id, user_id, store_id: store_id || null };
      const res = await settlementService.calculateFinalPrice(items, couponInfo);

      ctx.body = { code: 0, message: "预览成功", result: res };
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: error.message };
    }
  }
}

module.exports = new CouponController();

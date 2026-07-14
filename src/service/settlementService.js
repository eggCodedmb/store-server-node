const Goods = require("../model/product/goods");
const SpecOption = require("../model/product/specOption");
const couponService = require("./couponService");
const { Op } = require("sequelize");

class SettlementService {
  /**
   * 核心价格计算逻辑 (唯一真理)
   * @param {Array} items - 订单项 [{ goods_id, spec_ids, quantity }]
   * @param {Object} couponInfo - 优惠券信息 { coupon_id, store_id }（可选）
   * @returns {Promise<Object>} - { totalPrice, discountAmount, originalPrice, details }
   */
  async calculateFinalPrice(items, couponInfo = null, store_id = null) {
    let totalPrice = 0;
    const details = [];

    for (const item of items) {
      const { goods_id, spec_ids = [], quantity = 1 } = item;

      // 1. 查询商品基础价格
      const goods = await Goods.findByPk(goods_id);
      if (!goods) {
        throw new Error(`商品ID ${goods_id} 不存在`);
      }

      // 验证门店匹配与库存
      if (store_id && goods.store_id != store_id) {
        throw new Error(`商品 ${goods.goods_name} 不在当前门店`);
      }
      if (goods.goods_num < quantity) {
        throw new Error(`商品 ${goods.goods_name} 库存不足`);
      }

      let itemBasePrice = parseFloat(goods.goods_price);
      let specPriceDelta = 0;
      const specDetails = [];

      // 2. 查询规格增量
      if (spec_ids && spec_ids.length > 0) {
        const options = await SpecOption.findAll({
          where: {
            id: { [Op.in]: spec_ids },
          },
        });

        options.forEach((opt) => {
          specPriceDelta += parseFloat(opt.price_delta);
          specDetails.push({
            id: opt.id,
            name: opt.name,
            price_delta: opt.price_delta,
          });
        });
      }

      // 3. 计算单项总价
      const unitPrice = itemBasePrice + specPriceDelta;
      const itemTotal = unitPrice * quantity;

      totalPrice += itemTotal;

      details.push({
        goods_id,
        goods_name: goods.goods_name,
        unit_price: unitPrice.toFixed(2),
        quantity,
        item_total: itemTotal.toFixed(2),
        specs: specDetails,
      });
    }

    const originalPrice = totalPrice;
    let discountAmount = 0;

    // 4. 应用优惠券折扣
    if (couponInfo && couponInfo.coupon_id) {
      const userId = couponInfo.user_id;
      const storeId = couponInfo.store_id || null;

      const validation = await couponService.validateCoupon(
        couponInfo.coupon_id,
        userId,
        totalPrice,
        storeId
      );

      if (!validation.valid) {
        throw new Error(validation.reason);
      }

      discountAmount = validation.discount_amount;
      totalPrice = Math.max(0, totalPrice - discountAmount);
    }

    return {
      total_price: totalPrice.toFixed(2),
      discount_amount: discountAmount.toFixed(2),
      original_price: originalPrice.toFixed(2),
      items: details,
    };
  }
}

module.exports = new SettlementService();

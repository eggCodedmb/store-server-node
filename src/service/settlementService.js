const Goods = require("../model/product/goods");
const SpecOption = require("../model/product/specOption");
const { Op } = require("sequelize");

class SettlementService {
  /**
   * 核心价格计算逻辑 (唯一真理)
   * @param {Array} items - 订单项 [{ goods_id, spec_ids, quantity }]
   * @returns {Promise<Object>} - { totalPrice, details }
   */
  async calculateFinalPrice(items) {
    let totalPrice = 0;
    const details = [];

    for (const item of items) {
      const { goods_id, spec_ids = [], quantity = 1 } = item;

      // 1. 查询商品基础价格
      const goods = await Goods.findByPk(goods_id);
      if (!goods) {
        throw new Error(`商品ID ${goods_id} 不存在`);
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

    // 这里未来可以加入 满减、优惠券等逻辑
    // totalPrice = applyDiscounts(totalPrice);

    return {
      total_price: totalPrice.toFixed(2),
      items: details,
    };
  }
}

module.exports = new SettlementService();

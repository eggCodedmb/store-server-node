const CouponTemplate = require("../model/coupon/couponTemplate");
const UserCoupon = require("../model/coupon/userCoupon");
const Store = require("../model/store/store");
const User = require("../model/user/user");
const seq = require("../db/seq");
const { Op } = require("sequelize");

class CouponService {
  /**
   * 创建优惠券模板
   * @param {Object} data - 模板数据
   * @param {number} userId - 创建者 ID
   * @returns {Promise<Object>} 创建的模板
   */
  async createTemplate(data, userId) {
    // 满减券必须设置最低消费
    if (data.type === 1 && (!data.min_spend || data.min_spend <= 0)) {
      throw new Error("满减券必须设置最低消费金额");
    }
    // 折扣券的 value 必须在 0~1 之间
    if (data.type === 2 && (data.value <= 0 || data.value >= 1)) {
      throw new Error("折扣比例必须在 0 到 1 之间");
    }
    // 时间校验
    if (new Date(data.end_time) <= new Date(data.start_time)) {
      throw new Error("结束时间必须晚于开始时间");
    }

    const template = await CouponTemplate.create({
      ...data,
      created_by: userId,
    });
    return template;
  }

  /**
   * 更新优惠券模板
   * @param {number} templateId - 模板 ID
   * @param {Object} data - 更新数据
   * @returns {Promise<Object>} 更新后的模板
   */
  async updateTemplate(templateId, data) {
    const template = await CouponTemplate.findByPk(templateId);
    if (!template) {
      throw new Error("优惠券模板不存在");
    }
    await template.update(data);
    return template;
  }

  /**
   * 查询优惠券模板列表（分页）
   * @param {Object} filters - 筛选条件 { store_id, status, type }
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns {Promise<Object>} 分页结果
   */
  async findTemplates(filters = {}, pageNum = 1, pageSize = 10) {
    const where = {};
    if (filters.store_id !== undefined && filters.store_id !== "") {
      where.store_id = filters.store_id;
    }
    if (filters.status !== undefined && filters.status !== "") {
      where.status = filters.status;
    }
    if (filters.type !== undefined && filters.type !== "") {
      where.type = filters.type;
    }

    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await CouponTemplate.findAndCountAll({
      where,
      offset,
      limit: +pageSize,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Store, attributes: ["id", "name"] },
        { model: User, as: "creator", attributes: ["id", "nick_name", "user_name"] },
      ],
      distinct: true,
    });

    return {
      pageNum: +pageNum,
      pageSize: +pageSize,
      total: count,
      list: rows,
    };
  }

  /**
   * 查询单个模板详情
   * @param {number} templateId
   * @returns {Promise<Object>}
   */
  async findTemplateById(templateId) {
    const template = await CouponTemplate.findByPk(templateId, {
      include: [
        { model: Store, attributes: ["id", "name"] },
      ],
    });
    if (!template) {
      throw new Error("优惠券模板不存在");
    }
    return template;
  }

  /**
   * 用户可领取的优惠券列表
   * @param {number} userId - 当前用户 ID
   * @param {number|null} storeId - 当前门店 ID（可选）
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns {Promise<Object>}
   */
  async getAvailableCoupons(userId, storeId = null, pageNum = 1, pageSize = 10) {
    const now = new Date();
    const where = {
      status: 1,
      start_time: { [Op.lte]: now },
      end_time: { [Op.gte]: now },
      [Op.or]: [
        { total_count: -1 }, // 不限量
        { claimed_count: { [Op.lt]: seq.col("total_count") } }, // 还有剩余
      ],
    };

    // 门店筛选：平台通用券 + 当前门店券
    if (storeId) {
      where[Op.or] = [
        { store_id: null },
        { store_id: storeId },
      ];
    } else {
      where.store_id = null;
    }

    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await CouponTemplate.findAndCountAll({
      where,
      offset,
      limit: +pageSize,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Store, attributes: ["id", "name"] },
      ],
      distinct: true,
    });

    // 查询用户已领取数量，标记是否可领取
    const templates = rows.map((t) => t.toJSON());

    return {
      pageNum: +pageNum,
      pageSize: +pageSize,
      total: count,
      list: templates,
    };
  }

  /**
   * 领取优惠券
   * @param {number} templateId - 模板 ID
   * @param {number} userId - 用户 ID
   * @returns {Promise<Object>} 领取的用户优惠券
   */
  async claimCoupon(templateId, userId) {
    const transaction = await seq.transaction();
    try {
      // 1. 查询模板（加锁防并发）
      const template = await CouponTemplate.findByPk(templateId, {
        transaction,
        lock: true,
      });

      if (!template) {
        throw new Error("优惠券不存在");
      }

      // 2. 校验模板状态
      if (template.status !== 1) {
        throw new Error("优惠券已停用");
      }

      const now = new Date();
      if (now < new Date(template.start_time)) {
        throw new Error("优惠券尚未开始");
      }
      if (now > new Date(template.end_time)) {
        throw new Error("优惠券已过期");
      }

      // 3. 校验库存
      if (template.total_count !== -1 && template.claimed_count >= template.total_count) {
        throw new Error("优惠券已领完");
      }

      // 4. 校验用户领取限制
      const userClaimedCount = await UserCoupon.count({
        where: {
          user_id: userId,
          template_id: templateId,
        },
        transaction,
      });

      if (userClaimedCount >= template.per_user_limit) {
        throw new Error("已达到领取上限");
      }

      // 5. 创建用户优惠券
      const userCoupon = await UserCoupon.create(
        {
          user_id: userId,
          template_id: templateId,
          status: 0,
          claimed_at: now,
        },
        { transaction }
      );

      // 6. 更新已领取数量
      template.claimed_count += 1;
      await template.save({ transaction });

      await transaction.commit();
      return userCoupon;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 查询用户的优惠券列表
   * @param {number} userId
   * @param {number|null} status - 筛选状态
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns {Promise<Object>}
   */
  async getUserCoupons(userId, status = null, pageNum = 1, pageSize = 10) {
    const where = { user_id: userId };
    if (status !== null && status !== undefined && status !== "") {
      where.status = +status;
    }

    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await UserCoupon.findAndCountAll({
      where,
      offset,
      limit: +pageSize,
      order: [["claimed_at", "DESC"]],
      include: [
        {
          model: CouponTemplate,
          as: "template",
          include: [{ model: Store, attributes: ["id", "name"] }],
        },
      ],
      distinct: true,
    });

    return {
      pageNum: +pageNum,
      pageSize: +pageSize,
      total: count,
      list: rows,
    };
  }

  /**
   * 校验优惠券是否可用于订单（不修改状态）
   * @param {number} userCouponId - 用户优惠券 ID
   * @param {number} userId - 用户 ID
   * @param {number} totalPrice - 订单原价
   * @param {number|null} storeId - 门店 ID
   * @returns {Promise<Object>} { valid, discount_amount, reason }
   */
  async validateCoupon(userCouponId, userId, totalPrice, storeId = null) {
    const userCoupon = await UserCoupon.findOne({
      where: { id: userCouponId, user_id: userId },
      include: [{ model: CouponTemplate, as: "template" }],
    });

    if (!userCoupon) {
      return { valid: false, discount_amount: 0, reason: "优惠券不存在" };
    }

    if (userCoupon.status !== 0) {
      return { valid: false, discount_amount: 0, reason: "优惠券不可用" };
    }

    const template = userCoupon.template;
    const now = new Date();

    if (now > new Date(template.end_time)) {
      return { valid: false, discount_amount: 0, reason: "优惠券已过期" };
    }

    if (template.status !== 1) {
      return { valid: false, discount_amount: 0, reason: "优惠券已停用" };
    }

    // 门店校验
    if (template.store_id && template.store_id !== storeId) {
      return { valid: false, discount_amount: 0, reason: "该优惠券不适用于当前门店" };
    }

    // 最低消费校验
    if (totalPrice < parseFloat(template.min_spend)) {
      return {
        valid: false,
        discount_amount: 0,
        reason: `未满足最低消费 ${template.min_spend} 元`,
      };
    }

    // 计算优惠金额
    const discount = this.calculateDiscount(template, totalPrice);

    return { valid: true, discount_amount: discount, reason: null };
  }

  /**
   * 计算优惠金额
   * @param {Object} template - 优惠券模板
   * @param {number} totalPrice - 订单原价
   * @returns {number} 优惠金额
   */
  calculateDiscount(template, totalPrice) {
    let discount = 0;
    const value = parseFloat(template.value);
    const price = parseFloat(totalPrice);

    switch (template.type) {
      case 1: // 满减券
        discount = value;
        break;
      case 2: // 折扣券
        discount = price * (1 - value);
        if (template.max_discount) {
          discount = Math.min(discount, parseFloat(template.max_discount));
        }
        break;
      case 3: // 固定金额券
        discount = value;
        break;
    }

    // 优惠金额不超过订单总价
    discount = Math.min(discount, price);
    return Math.round(discount * 100) / 100; // 保留两位小数
  }

  /**
   * 核销优惠券（下单成功后调用）
   * @param {number} userCouponId - 用户优惠券 ID
   * @param {number} orderId - 订单 ID
   * @returns {Promise<void>}
   */
  async useCoupon(userCouponId, orderId) {
    const userCoupon = await UserCoupon.findByPk(userCouponId);
    if (!userCoupon) {
      throw new Error("优惠券不存在");
    }
    if (userCoupon.status !== 0) {
      throw new Error("优惠券已使用");
    }

    userCoupon.status = 1;
    userCoupon.order_id = orderId;
    userCoupon.used_at = new Date();
    await userCoupon.save();
  }

  /**
   * 退还优惠券（订单取消时调用）
   * @param {number} orderId - 订单 ID
   * @returns {Promise<void>}
   */
  async refundCoupon(orderId) {
    const userCoupon = await UserCoupon.findOne({
      where: { order_id: orderId, status: 1 },
    });
    if (!userCoupon) return;

    userCoupon.status = 0;
    userCoupon.order_id = null;
    userCoupon.used_at = null;
    await userCoupon.save();
  }

  /**
   * 查看某模板的领取/使用记录
   * @param {number} templateId
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns {Promise<Object>}
   */
  async getTemplateRecords(templateId, pageNum = 1, pageSize = 10) {
    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await UserCoupon.findAndCountAll({
      where: { template_id: templateId },
      offset,
      limit: +pageSize,
      order: [["claimed_at", "DESC"]],
      include: [
        { model: User, attributes: ["id", "nick_name", "user_name", "avatar"] },
      ],
      distinct: true,
    });

    return {
      pageNum: +pageNum,
      pageSize: +pageSize,
      total: count,
      list: rows,
    };
  }
}

module.exports = new CouponService();

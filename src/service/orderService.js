const Order = require("../model/order/order");
const OrderItem = require("../model/order/orderItem");
const Goods = require("../model/product/goods");
const Address = require("../model/address/address");
const User = require("../model/user/user");
const UserCoupon = require("../model/coupon/userCoupon");
const CouponTemplate = require("../model/coupon/couponTemplate");
const Store = require("../model/store/store");
const seq = require("../db/seq");
const { Op } = require("sequelize");
const { productInventory } = require("../service/goodsService");
const { delKeyAll } = require("../utils/redis");
class OrderService {
  async createOrder(order, orderItems) {
    const transaction = await seq.transaction(); // 开始事务
    try {
      // 库存减少方法
      await Promise.all(
        orderItems.map(async (item) => {
          return productInventory(item.id, item.quantity, transaction);
        })
      );

      // 创建订单
      const res = await Order.create(order, { transaction });

      // 组合子订单项
      const orderItemsData = orderItems.map((item) => ({
        order_id: res.id,
        goods_id: +item.id,
        price: item.price || item.goods_price || 0, // 兼容新旧接口的 price 字段
        quantity: item.quantity,
        specs: item.specs || null, // 兼容新接口的 specs 字段
        spec_ids: item.spec_ids || null // 新增：保存规格ID列表
      }));

      const orderService = new OrderService();

      // 批量创建订单项
      await orderService.createOrderItem(orderItemsData, transaction);
      // 提交事务
      await transaction.commit();

      return res.dataValues;
    } catch (error) {
      await transaction.rollback();
      console.error("创建订单失败:", error);
      throw error; // 保留原始错误信息（如 "库存不足"、"商品不存在"）
    }
  }
  /**
   *
   * @param {*} orderItems 子订单项
   */
  async createOrderItem(orderItems, transaction) {
    try {
      // 批量创建订单项
      await OrderItem.bulkCreate(orderItems, { transaction });
      // 删除redis避免缓存
      delKeyAll("product");
    } catch (error) {
      console.error("创建订单项失败:", error);
      throw new Error("创建订单项失败");
    }
  }

  // 查询某个用户下单的商品信息 (如果 user_id 为空则查询所有订单)
  async getUserOrdersWithProducts(user_id, pageNum = 1, pageSize = 10, filters = {}) {
    try {
      const offset = (pageNum - 1) * pageSize;
      const whereOpt = user_id ? { user_id } : {};

      // 添加额外的过滤条件
      if (filters.order_type && filters.order_type !== "") {
        whereOpt.order_type = filters.order_type;
      }
      if (filters.order_number && filters.order_number !== "") {
        whereOpt.order_number = {
          [Op.like]: `%${filters.order_number}%`,
        };
      }
      if (filters.state !== undefined && filters.state !== "" && filters.state !== null) {
        whereOpt.state = filters.state;
      }

      const { count, rows } = await Order.findAndCountAll({
        where: whereOpt,
        offset: offset,
        limit: +pageSize,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Goods,
                as: "product",
              },
            ],
          },
          {
            model: Address,
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "nick_name", "user_name", "avatar"],
          },
          {
            model: UserCoupon,
            include: [
              {
                model: CouponTemplate,
                as: "template",
                attributes: ["id", "name", "type", "value", "min_spend", "max_discount"],
                include: [
                  {
                    model: Store,
                    attributes: ["id", "name"],
                  },
                ],
              },
            ],
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
    } catch (error) {
      throw error;
    }
  }

  async deleteOrderById(id, transaction) {
    try {
      // 先删除订单项
      await OrderItem.destroy({
        where: { order_id: id },
        transaction,
      });

      // 再删除订单
      const res = await Order.destroy({
        where: { id },
        transaction,
      });

      return res;
    } catch (err) {
      throw err;
    }
  }

  async updateOrderStatus(id, status) {
    try {
      const res = await Order.findByPk(id);
      if (res) {
        // 如果尝试更新为已支付 (1)，但订单已经是取消状态 (4)
        if (status === 1 && res.state === 4) {
          const { orderExpiredError } = require("../constant/errType");
          throw orderExpiredError;
        }

        // 如果是更新为已支付状态 (1) 且是自提订单 (1) 且还没有取餐码
        if (status === 1 && res.order_type === 1 && !res.pickup_code) {
          const { getNextPickupCode } = require("../utils/redis");
          const code = await getNextPickupCode();
          res.pickup_code = "A" + code.toString().padStart(3, "0");
        }

        // 如果订单取消（状态变为4），退还优惠券
        if (status === 4 && res.coupon_id) {
          const couponService = require("../service/couponService");
          await couponService.refundCoupon(res.id);
        }

        // 如果状态不再是待支付 (0)，则删除 Redis 中的超时键
        if (status !== 0) {
          const { delKey } = require("../utils/redis");
          await delKey(`order_timeout:${id}`);
        }

        res.state = status;
        await res.save();
        return res;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
  /**
   *
   * @param {number} user_id
   * @param {string} goods_name
   * @returns
   */
  async orderSearch(user_id, name) {
    try {
      const orders = await Order.findAll({
        where: { user_id },
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Goods,
                as: "product",
                where: {
                  goods_name: {
                    [Op.like]: `%${name}%`,
                  },
                  status: 1,
                },
              },
            ],
          },
        ],
      });
      return orders ? orders : null;
    } catch (error) {
      throw error; // 抛出错误
    }
  }

  // 查询某个用户下的某个订单
  async findOrderById(user_id, id) {
    try {
      const res = await Order.findOne({
        where: {
          id: id,
          user_id: user_id,
        },
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Goods,
                as: "product",
              },
            ],
          },
          {
            model: Address,
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "nick_name", "user_name", "avatar"],
          },
          {
            model: UserCoupon,
            include: [
              {
                model: CouponTemplate,
                as: "template",
                attributes: ["id", "name", "type", "value", "min_spend", "max_discount"],
                include: [
                  {
                    model: Store,
                    attributes: ["id", "name"],
                  },
                ],
              },
            ],
          },
        ],
      });
      return res;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new OrderService();

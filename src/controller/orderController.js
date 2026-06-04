const {
  createOrder,
  deleteOrderById,
  updateOrderStatus,
  orderSearch,
  getUserOrdersWithProducts,
  findOrderById,
} = require("../service/orderService");
const { queryDefaultAddress } = require("../service/addressService");
const settlementService = require("../service/settlementService");
const {
  creatOrderError,
  deleteOrderError,
  verifyOntOrder,
  updateOrderError,
} = require("../constant/errType");
const GenId = require("../utils/IdGenerator");
class OrderController {
  /**
   * 价格预览/试算接口 (后端作为唯一真理)
   */
  async calculate(ctx) {
    try {
      const { items, coupon_id, store_id } = ctx.request.body;
      if (!items || items.length === 0) {
        throw new Error("结算商品不能为空");
      }

      // 如果传了优惠券，构建优惠券信息
      let couponInfo = null;
      if (coupon_id) {
        const user_id = ctx.state.user.id;
        couponInfo = { coupon_id, user_id, store_id: store_id || null };
      }

      const res = await settlementService.calculateFinalPrice(items, couponInfo);
      ctx.body = {
        code: 0,
        message: "计算成功",
        result: res,
      };
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: error.message };
    }
  }

  /**
   * 库存预检查接口 - 在创建订单前检查商品库存
   */
  async checkStock(ctx) {
    try {
      const { items } = ctx.request.body;
      if (!items || items.length === 0) {
        throw new Error("商品列表不能为空");
      }

      const Goods = require("../model/product/goods");
      const result = [];

      for (const item of items) {
        const goodsId = item.goods_id || item.id;
        const goods = await Goods.findByPk(goodsId);

        if (!goods) {
          result.push({
            goods_id: goodsId,
            name: item.name || '未知商品',
            available: false,
            reason: '商品不存在',
            stock: 0
          });
        } else if (goods.goods_num < item.quantity) {
          result.push({
            goods_id: goods.id,
            name: goods.goods_name,
            available: false,
            reason: '库存不足',
            stock: goods.goods_num
          });
        } else {
          result.push({
            goods_id: goods.id,
            name: goods.goods_name,
            available: true,
            stock: goods.goods_num
          });
        }
      }

      const allAvailable = result.every(r => r.available);

      ctx.body = {
        code: 0,
        message: allAvailable ? "库存充足" : "部分商品库存不足",
        result: {
          all_available: allAvailable,
          items: result
        }
      };
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: error.message };
    }
  }

  /**
   * 创建订单
   */
  async create(ctx) {
    try {
      const user_id = ctx.state.user.id;
      let data = ctx.request.body.data;

      if (!data || data.length === 0) {
        return ctx.app.emit("error", creatOrderError, ctx);
      }

      const address = await queryDefaultAddress(user_id);
      if (!address.id) {
        throw new Error("默认没有地址");
      }

      // 核心修改：重新计算总价，不信任前端传过来的 goods_price
      const calcItems = data.map(item => ({
        goods_id: item.id, // 老接口 item.id 实际上是 goods_id
        spec_ids: item.spec_ids || [],
        quantity: item.quantity
      }));
      const settlement = await settlementService.calculateFinalPrice(calcItems);

      const genid = new GenId({ WorkerId: 1 });
      const order_number = `D${genid.NextId()}`;

      // 组合订单
      const order = {
        user_id,
        address_id: +address.id,
        total_price: settlement.total_price,
        state: 0,
        order_number,
      };
      
      // 组合订单项
      const orderItems = settlement.items.map((item) => ({
        id: item.goods_id,
        goods_price: item.unit_price,
        quantity: item.quantity,
        specs: item.specs.map(s => s.name).join('/')
      }));

      // 创建订单
      const res = await createOrder(order, orderItems);
      // ... (timeout and redis logic remains)

      const { ORDER_TIMEOUT } = require("../config/config.default");
      const timeoutMinutes = parseInt(ORDER_TIMEOUT) || 15;

      // 计算过期时间并返回给前端
      const createdAt = new Date(res.createdAt).getTime();
      const expireTime = new Date(createdAt + timeoutMinutes * 60 * 1000);

      // 设置 Redis 过期倒计时，用于超时未支付自动取消
      try {
        const timeoutSeconds = timeoutMinutes * 60;
        const { setData } = require("../utils/redis");
        await setData(`order_timeout:${res.id}`, "pending", timeoutSeconds);
      } catch (redisErr) {
        console.error("Redis 设置超时失败，但不影响订单创建", redisErr);
      }

      // 返回消息
      ctx.body = {
        code: 0,
        message: "订单创建成功",
        result: {
          ...res,
          expire_time: expireTime,
        },
      };
    } catch (error) {
      creatOrderError.message = error.message;
      ctx.app.emit("error", creatOrderError, ctx);
      throw error;
    }
  }

  /**
   * 益禾堂小程序专用的新创建订单接口
   */
  async create_new(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const { items, order_type, address_id, remark, coupon_id } = ctx.request.body;

      if (!items || items.length === 0) {
        throw new Error("购物车不能为空");
      }

      // 核心修改：重新计算总价
      const calcItems = items.map(item => ({
        goods_id: item.goods_id || item.id,
        spec_ids: item.spec_ids || [],
        quantity: item.quantity
      }));

      // 如果传了优惠券，需要确定门店 ID（从商品中获取）
      let couponInfo = null;
      if (coupon_id) {
        const Goods = require("../model/product/goods");
        const firstGoods = await Goods.findByPk(calcItems[0].goods_id);
        const storeId = firstGoods ? firstGoods.store_id : null;
        couponInfo = { coupon_id, user_id, store_id: storeId };
      }

      const settlement = await settlementService.calculateFinalPrice(calcItems, couponInfo);

      const genid = new GenId({ WorkerId: 1 });
      const order_number = `YH${genid.NextId()}`;

      const orderData = {
        user_id,
        address_id: address_id || null, // 自提可为null
        total_price: settlement.total_price,
        order_number,
        state: 0, // 待支付
        order_type,
        remark,
        coupon_id: coupon_id || null,
        discount_amount: settlement.discount_amount,
        original_price: settlement.original_price,
      };
      // 创建订单项数据
      const orderItems = settlement.items.map(item => ({
        id: item.goods_id,
        quantity: item.quantity,
        price: item.unit_price,
        specs: item.specs.map(s => s.name).join('/'),
        spec_ids: item.specs.map(s => s.id).join(',') // 新增：保存规格ID列表
      }));

      const res = await createOrder(orderData, orderItems);

      // 核销优惠券
      if (coupon_id) {
        const couponService = require("../service/couponService");
        await couponService.useCoupon(coupon_id, res.id);
      }

      const { ORDER_TIMEOUT } = require("../config/config.default");
      const timeoutMinutes = parseInt(ORDER_TIMEOUT) || 15;

      // 计算过期时间并返回给前端
      const createdAt = new Date(res.createdAt).getTime();
      const expireTime = new Date(createdAt + timeoutMinutes * 60 * 1000);

      // 设置 Redis 过期倒计时，用于超时未支付自动取消 (过期时间根据 .env 配置，默认 15 分钟)
      try {
        const timeoutSeconds = timeoutMinutes * 60;
        const { setData } = require("../utils/redis");
        await setData(`order_timeout:${res.id}`, "pending", timeoutSeconds);
      } catch (redisErr) {
        console.error("Redis 设置超时失败，但不影响订单创建", redisErr);
      }

      ctx.body = {
        code: 0,
        message: "订单创建成功",
        result: {
          ...res,
          expire_time: expireTime,
        }
      };
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: error.message };
    }
  }

  /**
   * 模拟支付接口
   */
  async pay_order(ctx) {
    try {
      const { id } = ctx.request.body;
      const res = await updateOrderStatus(id, 1); // 1: 制作中/已支付
      if (res) {
        ctx.body = { code: 0, message: "支付成功", result: res };
      } else {
        ctx.body = { code: 404, message: "订单不存在" };
      }
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: "支付失败" };
    }
  }

  /**
   * 小程序端获取我的订单列表
   */
  async getMyOrders(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const { pageNum, pageSize, order_type, order_number, state } = ctx.request.query;
      const res = await getUserOrdersWithProducts(user_id, pageNum, pageSize, {
        order_type,
        order_number,
        state,
      });
      ctx.body = {
        code: 0,
        message: "获取成功",
        result: res
      };
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: "获取列表失败" };
    }
  }

  async findAllOrder(ctx) {
    try {
      // 如果 body 中明确传了 userId，则按该 userId 查（通常用于后台查特定用户订单）
      // 如果没有传，且用户不是超级管理员，则只查自己的
      // 这里为了简化，我们先支持从 body 传 userId，如果不传则查所有（后台逻辑）
      // 前台逻辑通常会传特定的过滤条件
      const { pageNum, pageSize, userId, order_type, order_number, state } = ctx.request.body;
      
      const res = await getUserOrdersWithProducts(userId, pageNum, pageSize, {
        order_type,
        order_number,
        state,
      });
      ctx.body = {
        code: 0,
        message: "订单列表获取成功",
        result: res
      };
    } catch (error) {
      ctx.app.emit("error", verifyOntOrder, ctx);
      throw error;
    }
  }

  async deleteOrder(ctx) {
    try {
      const { id } = ctx.params;
      const res = await deleteOrderById(id);
      ctx.body = {
        code: 0,
        message: "删除成功",
        result: res,
      };
    } catch (error) {
      ctx.app.emit("error", deleteOrderError, ctx);
      throw error;
    }
  }

  async updateStatus(ctx) {
    try {
      const { id } = ctx.request.params;
      const { state } = ctx.request.body;
      const res = await updateOrderStatus(id, state);
      if (res) {
        ctx.body = {
          code: 0,
          message: "状态更新成功",
          result: res,
        };
      } else {
        ctx.app.emit("error", updateOrderError, ctx);
      }
    } catch (error) {
      ctx.app.emit("error", updateOrderError, ctx);
      throw error;
    }
  }

  async search(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const { name } = ctx.request.query;
      const res = await orderSearch(user_id, name);
      ctx.body = {
        code: 0,
        message: "搜索订单成功",
        result: res,
      };
    } catch (error) {
      ctx.app.emit("error", verifyOntOrder, ctx);
      throw error;
    }
  }

  async getOneOrder(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const id = ctx.params.id || ctx.query.id;
      const res = await findOrderById(user_id, id);

      // 如果是待支付订单，增加过期时间字段
      if (res && res.state === 0) {
        const { ORDER_TIMEOUT } = require("../config/config.default");
        const timeoutMinutes = parseInt(ORDER_TIMEOUT) || 15;
        const createdAt = new Date(res.createdAt).getTime();
        res.dataValues.expire_time = new Date(createdAt + timeoutMinutes * 60 * 1000);
      }

      ctx.body = {
        code: 0,
        message: "获取订单成功",
        result: res,
      };
    } catch (error) {
      ctx.app.emit("error", verifyOntOrder, ctx);
      throw error;
    }
  }
}

module.exports = new OrderController();

const {
  createOrder,
  deleteOrderById,
  updateOrderStatus,
  orderSearch,
  getUserOrdersWithProducts,
  findOrderById,
} = require("../service/orderService");
const { queryDefaultAddress } = require("../service/addressService");
const {
  creatOrderError,
  deleteOrderError,
  verifyOntOrder,
  updateOrderError,
} = require("../constant/errType");
const GenId = require("../utils/IdGenerator");
class OrderController {
  /**
   * 创建订单
   * @param {Object} ctx - Koa 的上下文对象
   * @returns {Promise<void>}
   */
  async create(ctx) {
    try {
      const user_id = ctx.state.user.id;

      let data = ctx.request.body.data;

      if (data.lenght === 0) {
        return ctx.app.emit("error", creatOrderError, ctx);
      }

      const address = await queryDefaultAddress(user_id);

      if (!address.id) {
        throw new Error("默认没有地址");
      }

      const genid = new GenId({ WorkerId: 1 });

      // 计算总价
      let totalPrice = 0;

      data.map((item) => {
        totalPrice += item.goods_price * item.quantity;
        totalPrice = +totalPrice.toFixed(2);
      });

      // 生成订单号
      const order_number = `D${genid.NextId()}`;

      // 组合订单
      const order = {
        user_id,
        address_id: +address.id,
        total_price: totalPrice,
        state: 0,
        order_number,
      };
      
      // 组合订单项
      const orderItem = data.map((item) => ({
        id: item.id,
        goods_price: item.goods_price,
        quantity: item.quantity,
      }));

      // 创建订单
      const res = await createOrder(order, orderItem);

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
      const { items, order_type, address_id, remark } = ctx.request.body;

      if (!items || items.length === 0) {
        throw new Error("购物车不能为空");
      }

      const genid = new GenId({ WorkerId: 1 });
      const order_number = `YH${genid.NextId()}`;

      // 计算总价
      let total_price = 0;
      items.forEach((item) => {
        total_price += (item.totalPrice || item.price) * (item.quantity || 1);
      });

      const orderData = {
        user_id,
        address_id: address_id || null, // 自提可为null
        total_price,
        order_number,
        state: 0, // 待支付
        order_type,
        remark,
      };

      const orderItems = items.map(item => ({
        id: item.id, // 必须传 id，service 内部库存扣减依赖 item.id
        quantity: item.quantity,
        price: item.totalPrice / item.quantity,
        specs: Array.isArray(item.specs) ? item.specs.join('/') : item.specs
      }));

      const res = await createOrder(orderData, orderItems);
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

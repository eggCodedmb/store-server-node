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

      // 返回消息
      ctx.body = {
        code: 0,
        message: "订单创建成功",
        result: res,
      };
    } catch (error) {
      creatOrderError.message = error.message;
      ctx.app.emit("error", creatOrderError, ctx);
      throw error;
    }
  }

  async findAllOrder(ctx) {
    try {
      // 如果 body 中明确传了 userId，则按该 userId 查（通常用于后台查特定用户订单）
      // 如果没有传，且用户不是超级管理员，则只查自己的
      // 这里为了简化，我们先支持从 body 传 userId，如果不传则查所有（后台逻辑）
      // 前台逻辑通常会传特定的过滤条件
      const { pageNum, pageSize, userId } = ctx.request.body;
      
      const res = await getUserOrdersWithProducts(userId, pageNum, pageSize);
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
      const id = ctx.params.id;
      const res = await findOrderById(user_id, id);
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

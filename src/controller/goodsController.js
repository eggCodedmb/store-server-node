const {
  createGoods,
  updateGoods,
  removeGoods,
  restoreGoods,
  findGoods,
  getRemoveGoods,
  searchGoodsByName,
  queryNewGoogdsAll,
  getGoodsWithTotalSales,
  getProductById,
  getGoodsDetailById,
} = require("../service/goodsService");
const { publishGoodsError, invalidGoodsID } = require("../constant/errType");
const Goods = require("../model/product/goods");

class GoodsController {
  async create(ctx) {
    try {
      const { updatedAt, ...res } = await createGoods(ctx.request.body);
      ctx.body = { code: 0, message: "发布商品成功", result: res };
    } catch (err) {
      ctx.app.emit("error", publishGoodsError, ctx);
    }
  }

  async update(ctx) {
    try {
      const id = ctx.params.id;
      const data = ctx.request.body;
      const res = await updateGoods(id, data);
      if (res) {
        return (ctx.body = { code: 0, message: "修改商品成功", result: res });
      }
    } catch (error) {
      ctx.app.emit("error", invalidGoodsID, ctx);
      throw error;
    }
  }

  async removal(ctx) {
    try {
      const ids = ctx.request.body;
      const res = await removeGoods(ids);
      if (res) {
        ctx.body = { code: 0, message: "商品下架成功", result: res };
      } else {
        return ctx.app.emit("error", invalidGoodsID, ctx);
      }
    } catch (error) {
      throw error;
    }
  }

  async restore(ctx) {
    try {
      const ids = ctx.request.body;
      const res = await restoreGoods(ids);
      if (res) {
        ctx.body = { code: 0, message: "商品上架成功", result: res };
      } else {
        return ctx.app.emit("error", invalidGoodsID, ctx);
      }
    } catch (error) {
      throw error;
    }
  }

  async findAll(ctx) {
    try {
      const res = await findGoods(ctx.request.query);
      ctx.body = { code: 0, message: "获取商品成功", result: res };
    } catch (error) {
      console.log(error);
    }
  }

  async getRemove(ctx) {
    try {
      const { pageNum = 1, pageSize = 10, storeId = "" } = ctx.request.query;
      const res = await getRemoveGoods(pageNum, pageSize, storeId);
      ctx.body = { code: 0, message: "获取下架商品成功", result: res };
    } catch (error) {
      console.log(error);
    }
  }

  async findGoodsByName(ctx) {
    try {
      const { name, storeId = "" } = ctx.request.query;
      const res = await searchGoodsByName(name, 10, storeId);
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.log(error);
    }
  }

  async queryNewGoods(ctx) {
    try {
      const { pageNum = 1, pageSize = 10, storeId = "" } = ctx.request.query;
      const res = await queryNewGoogdsAll(pageNum, pageSize, storeId);
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.log(error);
    }
  }

  async querySalesGoods(ctx) {
    try {
      const { pageNum = 1, pageSize = 10, order = "ASC", storeId = "" } = ctx.request.query;
      const res = await getGoodsWithTotalSales(pageNum, pageSize, order, storeId);
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.log(error);
    }
  }

  async getProduct(ctx) {
    try {
      const id = ctx.params.id;
      const res = await getProductById(id);
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.log(error);
    }
  }

  async getDetail(ctx) {
    try {
      const { id } = ctx.params;
      const res = await getGoodsDetailById(id);
      if (res) {
        ctx.body = { code: 0, message: "获取商品详情成功", result: res };
      } else {
        ctx.app.emit("error", invalidGoodsID, ctx);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 批量校验商品在目标门店的可用性
   * 用于切换门店时检查购物车商品
   */
  async batchCheckAvailability(ctx) {
    try {
      const { items, store_id } = ctx.request.body;

      if (!items || items.length === 0) {
        ctx.body = { code: 0, message: "商品列表为空", result: [] };
        return;
      }

      if (!store_id) {
        throw new Error("目标门店ID不能为空");
      }

      const result = [];

      for (const item of items) {
        // 按名称在目标门店查找同名商品（精确匹配）
        const match = await Goods.findOne({
          where: {
            goods_name: item.name,
            store_id: store_id,
            status: 1
          }
        });

        if (match) {
          result.push({
            original_id: item.goods_id,
            original_name: item.name,
            matched_id: match.id,
            matched_name: match.goods_name,
            available: match.goods_num > 0,
            stock: match.goods_num,
            price: parseFloat(match.goods_price || '0')
          });
        } else {
          result.push({
            original_id: item.goods_id,
            original_name: item.name,
            matched_id: null,
            matched_name: null,
            available: false,
            stock: 0,
            price: 0,
            reason: '该门店无此商品'
          });
        }
      }

      ctx.body = {
        code: 0,
        message: "校验成功",
        result: result
      };
    } catch (error) {
      console.error("批量校验商品失败:", error);
      ctx.body = { code: 500, message: error.message };
    }
  }
}

module.exports = new GoodsController();

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
      const { pageNum = 1, pageSize = 10 } = ctx.request.query;
      const res = await getRemoveGoods(pageNum, pageSize);
      ctx.body = { code: 0, message: "获取下架商品成功", result: res };
    } catch (error) {
      console.log(error);
    }
  }

  async findGoodsByName(ctx) {
    try {
      const { name } = ctx.request.query;
      const res = await searchGoodsByName(name);
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.log(error);
    }
  }

  async queryNewGoods(ctx) {
    try {
      const { pageNum = 1, pageSize = 10 } = ctx.request.query;
      const res = await queryNewGoogdsAll(pageNum, pageSize);
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.log(error);
    }
  }

  async querySalesGoods(ctx) {
    try {
      const { pageNum = 1, pageSize = 10, order = "ASC" } = ctx.request.query;
      const res = await getGoodsWithTotalSales(pageNum, pageSize, order);
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
}

module.exports = new GoodsController();

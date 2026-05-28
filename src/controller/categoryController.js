const {
  createCategory,
  updateCategory,
  removeCategory,
  findAllCategories,
  findGoodsByCategory,
  addGoodsToCategory,
  removeGoodsFromCategory,
} = require("../service/categoryService");

class CategoryController {
  async create(ctx) {
    try {
      const res = await createCategory(ctx.request.body);
      ctx.body = {
        code: 0,
        message: "创建分类成功",
        result: res,
      };
    } catch (err) {
      console.error(err);
      ctx.body = {
        code: 10001,
        message: "创建分类失败",
        result: err.message || err,
      };
    }
  }

  async update(ctx) {
    try {
      const id = ctx.params.id;
      const res = await updateCategory(id, ctx.request.body);
      if (res) {
        ctx.body = {
          code: 0,
          message: "修改分类成功",
          result: res,
        };
      } else {
        ctx.body = {
          code: 10002,
          message: "分类不存在",
        };
      }
    } catch (err) {
      console.error(err);
      ctx.body = {
        code: 10003,
        message: "修改分类失败",
      };
    }
  }

  async remove(ctx) {
    try {
      const id = ctx.params.id;
      const res = await removeCategory(id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "删除分类成功",
          result: res,
        };
      } else {
        ctx.body = {
          code: 10002,
          message: "分类不存在",
        };
      }
    } catch (err) {
      console.error(err);
      ctx.body = {
        code: 10004,
        message: "删除分类失败",
      };
    }
  }

  async findAll(ctx) {
    try {
      const res = await findAllCategories();
      ctx.body = {
        code: 0,
        message: "获取分类列表成功",
        result: res,
      };
    } catch (err) {
      console.error(err);
      ctx.body = {
        code: 10005,
        message: "获取分类列表失败",
      };
    }
  }

  async getGoods(ctx) {
    try {
      const categoryId = ctx.params.id;
      const { pageNum = 1, pageSize = 10 } = ctx.request.query;
      const res = await findGoodsByCategory(categoryId, pageNum, pageSize);
      ctx.body = {
        code: 0,
        message: "获取分类下商品成功",
        result: res,
      };
    } catch (err) {
      console.error(err);
      ctx.body = {
        code: 10006,
        message: "获取分类下商品失败",
      };
    }
  }

  async addGoods(ctx) {
    try {
      const categoryId = ctx.params.id;
      const { goodsId } = ctx.request.body;
      const res = await addGoodsToCategory(goodsId, categoryId);
      if (res) {
        ctx.body = {
          code: 0,
          message: "添加商品到分类成功",
        };
      } else {
        ctx.body = {
          code: 10007,
          message: "添加失败，商品或分类不存在",
        };
      }
    } catch (err) {
      console.error(err);
      ctx.body = {
        code: 10008,
        message: "添加商品到分类失败",
      };
    }
  }

  async removeGoods(ctx) {
    try {
      const categoryId = ctx.params.id;
      const { goodsId } = ctx.request.body;
      const res = await removeGoodsFromCategory(goodsId, categoryId);
      if (res) {
        ctx.body = {
          code: 0,
          message: "从分类移除商品成功",
        };
      } else {
        ctx.body = {
          code: 10007,
          message: "移除失败，商品或分类不存在",
        };
      }
    } catch (err) {
      console.error(err);
      ctx.body = {
        code: 10009,
        message: "从分类移除商品失败",
      };
    }
  }
}

module.exports = new CategoryController();

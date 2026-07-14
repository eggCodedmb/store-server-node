const {
  createBanner,
  updateBanner,
  removeBanner,
  findAllBanners,
  findActiveBanners,
  findBannerById,
} = require("../service/bannerService");

class BannerController {
  async create(ctx) {
    try {
      const banner = ctx.request.body;
      if (!banner.title || !banner.image_url) {
        return ctx.app.emit("error", { code: "11000", message: "Banner标题和图片地址不能为空" }, ctx);
      }
      const res = await createBanner(banner);
      ctx.body = {
        code: 0,
        message: "创建Banner成功",
        result: res,
      };
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: "11001", message: "创建Banner失败" }, ctx);
    }
  }

  async update(ctx) {
    try {
      const id = ctx.params.id;
      const banner = ctx.request.body;
      const res = await updateBanner(id, banner);
      if (res) {
        ctx.body = {
          code: 0,
          message: "更新Banner成功",
          result: "",
        };
      } else {
        ctx.app.emit("error", { code: "11002", message: "更新Banner失败" }, ctx);
      }
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: "11002", message: "更新Banner失败" }, ctx);
    }
  }

  async deleteBanner(ctx) {
    try {
      const id = ctx.params.id;
      const res = await removeBanner(id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "删除Banner成功",
          result: "",
        };
      } else {
        ctx.app.emit("error", { code: "11003", message: "删除Banner失败" }, ctx);
      }
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: "11003", message: "删除Banner失败" }, ctx);
    }
  }

  async findAll(ctx) {
    try {
      const { 
        pageNum, 
        pageSize, 
        title, 
        storeId, 
        store_id 
      } = { ...ctx.request.body, ...ctx.request.query };
      
      const finalStoreId = storeId !== undefined ? storeId : store_id;
      
      const res = await findAllBanners(pageSize, pageNum, title, finalStoreId);
      ctx.body = {
        code: 0,
        message: "获取Banner列表成功",
        result: res,
      };
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: "11005", message: "获取Banner列表失败" }, ctx);
    }
  }

  async findActive(ctx) {
    try {
      const { storeId, store_id } = ctx.request.query;
      const finalStoreId = storeId || store_id;
      const res = await findActiveBanners(finalStoreId);
      ctx.body = {
        code: 0,
        message: "获取启用Banner列表成功",
        result: res,
      };
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: "11005", message: "获取展示Banner列表失败" }, ctx);
    }
  }

  async getDetail(ctx) {
    try {
      const id = ctx.params.id;
      const res = await findBannerById(id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "获取Banner详情成功",
          result: res,
        };
      } else {
        ctx.app.emit("error", { code: "11004", message: "Banner不存在" }, ctx);
      }
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: "11004", message: "获取Banner详情失败" }, ctx);
    }
  }
}

module.exports = new BannerController();

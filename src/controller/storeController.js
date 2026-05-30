const {
  createStore,
  getStoresByUserId,
  findAllStores,
  findNearbyStores,
  getStoreById,
  updateStoreById,
  deleteStoreById,
} = require("../service/storeService");

class StoreController {
  async create(ctx) {
    const { name, description, address, business_hours, longitude, latitude, phone, logo } = ctx.request.body;
    const { id: user_id } = ctx.state.user;

    try {
      const res = await createStore({
        name,
        description,
        address,
        business_hours,
        longitude,
        latitude,
        phone,
        logo,
        user_id,
      });
      ctx.body = { code: 0, message: "门店创建成功", result: res };
    } catch (err) {
      console.error(err);
      ctx.app.emit("error", { code: 500, message: "门店创建失败", result: err }, ctx);
    }
  }

  async list(ctx) {
    const { id: user_id } = ctx.state.user;
    const { pageNum = 1, pageSize = 20 } = ctx.request.query;
    try {
      const res = await getStoresByUserId(user_id, pageNum, pageSize);
      ctx.body = { code: 0, message: "获取门店列表成功", result: res };
    } catch (err) {
      console.error(err);
      ctx.app.emit("error", { code: 500, message: "获取门店列表失败", result: err }, ctx);
    }
  }

  async allList(ctx) {
    const { pageNum = 1, pageSize = 20, keyword = "" } = ctx.request.query;
    try {
      const res = await findAllStores(pageNum, pageSize, keyword);
      ctx.body = { code: 0, message: "获取门店列表成功", result: res };
    } catch (err) {
      console.error(err);
      ctx.app.emit("error", { code: 500, message: "获取门店列表失败", result: err }, ctx);
    }
  }

  async nearbyList(ctx) {
    const { longitude, latitude, pageNum = 1, pageSize = 20, keyword = "" } = ctx.request.query;
    if (!longitude || !latitude) {
      return ctx.app.emit("error", { code: 400, message: "缺少经纬度信息", result: "" }, ctx);
    }
    try {
      const res = await findNearbyStores(longitude, latitude, pageNum, pageSize, keyword);
      ctx.body = { code: 0, message: "获取附近门店成功", result: res };
    } catch (err) {
      console.error(err);
      ctx.app.emit("error", { code: 500, message: "获取附近门店失败", result: err }, ctx);
    }
  }

  async getDetail(ctx) {
    const { id } = ctx.params;
    try {
      const res = await getStoreById(id);
      if (res) {
        ctx.body = { code: 0, message: "获取门店详情成功", result: res };
      } else {
        ctx.app.emit("error", { code: 404, message: "门店不存在", result: "" }, ctx);
      }
    } catch (err) {
      console.error(err);
      ctx.app.emit("error", { code: 500, message: "获取门店详情失败", result: err }, ctx);
    }
  }

  async update(ctx) {
    const id = ctx.params.id;
    const { name, description, address, business_hours, longitude, latitude, phone, logo } = ctx.request.body;
    try {
      const res = await updateStoreById(id, {
        name,
        description,
        address,
        business_hours,
        longitude,
        latitude,
        phone,
        logo,
      });
      if (res) {
        ctx.body = { code: 0, message: "门店更新成功", result: { id } };
      } else {
        ctx.app.emit("error", { code: 400, message: "门店更新失败或门店不存在", result: "" }, ctx);
      }
    } catch (err) {
      console.error(err);
      ctx.app.emit("error", { code: 500, message: "门店更新失败", result: err }, ctx);
    }
  }

  async remove(ctx) {
    const id = ctx.params.id;
    try {
      const res = await deleteStoreById(id);
      if (res) {
        ctx.body = { code: 0, message: "门店删除成功", result: { id } };
      } else {
        ctx.app.emit("error", { code: 400, message: "门店删除失败或门店不存在", result: "" }, ctx);
      }
    } catch (err) {
      console.error(err);
      ctx.app.emit("error", { code: 500, message: "门店删除失败", result: err }, ctx);
    }
  }
}

module.exports = new StoreController();
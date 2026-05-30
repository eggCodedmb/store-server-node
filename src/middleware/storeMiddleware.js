const { checkStoreOwnership } = require("../service/storeService");

const verifyStoreOwnership = async (ctx, next) => {
  const { id: user_id } = ctx.state.user;
  const store_id = ctx.params.id || ctx.request.body.store_id;

  if (!store_id) {
    ctx.app.emit("error", { code: 400, message: "缺少门店ID" }, ctx);
    return;
  }

  try {
    const isOwner = await checkStoreOwnership(store_id, user_id);
    if (!isOwner) {
      ctx.app.emit("error", { code: 403, message: "无权操作该门店或门店不存在" }, ctx);
      return;
    }
  } catch (err) {
    console.error(err);
    ctx.app.emit("error", { code: 500, message: "门店归属校验失败", result: err }, ctx);
    return;
  }

  await next();
};

module.exports = {
  verifyStoreOwnership,
};
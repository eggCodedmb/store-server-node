const Router = require("koa-router");
const { create, list, allList, nearbyList, getDetail, update, remove } = require("../controller/storeController");
const { auth } = require("../middleware/authMiddleware");
const { verifyStoreOwnership } = require("../middleware/storeMiddleware");

const router = new Router({ prefix: "/store" });

// 获取所有门店列表 (不带 auth，用于小程序首页)
router.get("/all", allList);

// 获取附近门店列表 (不带 auth)
router.get("/nearby", nearbyList);

// 获取门店详情 (不带 auth，用于小程序)
router.get("/detail/:id", getDetail);

// 创建门店
router.post("/", auth, create);

// 获取当前用户的门店列表
router.get("/list", auth, list);

// 更新门店
router.put("/:id", auth, verifyStoreOwnership, update);

// 删除门店
router.delete("/:id", auth, verifyStoreOwnership, remove);

module.exports = router;
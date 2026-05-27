const Router = require("koa-router");

const { auth, authorize } = require("../middleware/authMiddleware");
const {
  create,
  update,
  remove,
  findAll,
  getGoods,
  addGoods,
  removeGoods,
} = require("../controller/categoryController");

const router = new Router({ prefix: "/category" });

// 获取所有分类
router.get("/", findAll);

// 获取分类下的商品
router.get("/:id/goods", getGoods);

// 创建分类 (需要管理员权限)
router.post("/", auth, authorize(), create);

// 更新分类 (需要管理员权限)
router.put("/:id", auth, authorize(), update);

// 删除分类 (需要管理员权限)
router.delete("/:id", auth, authorize(), remove);

// 为分类添加商品 (需要管理员权限)
router.post("/:id/goods", auth, authorize(), addGoods);

// 从分类移除商品 (需要管理员权限)
router.delete("/:id/goods", auth, authorize(), removeGoods);

module.exports = router;

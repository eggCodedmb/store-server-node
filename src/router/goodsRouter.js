// 引入 Koa 路由
const Router = require("koa-router");

// 引入认证和权限中间件
const { auth, authorize } = require("../middleware/authMiddleware");

const { validateParams } = require("../middleware/genericMiddleware");

// 引入商品控制器方法
const goodsController = require("../controller/goodsController");
const { goodsFormatRules } = require("../constant/rules");
const { goodsUpdateError } = require("../constant/errType");
// 实例化路由
const router = new Router({ prefix: "/goods" });

// 路由：创建商品
router.post(
  "/",
  validateParams(goodsFormatRules, goodsUpdateError),
  auth,
  authorize(),
  goodsController.create
);

// 路由：更新商品信息
router.put(
  "/:id",
  validateParams(goodsFormatRules, goodsUpdateError),
  auth,
  authorize(),
  goodsController.update
);

// 路由：删除商品
router.post("/off", auth, authorize(), goodsController.removal);

// 路由：恢复删除的商品
router.post("/on", auth, authorize(), goodsController.restore);

// 路由：获取所有删除的商品
router.post("/removal", auth, authorize(), goodsController.getRemove);

// 路由：获取所有商品
router.get("/", goodsController.findAll);

// 路由：获取商品详情 (包含规格信息)
router.get("/detail/:id", goodsController.getDetail);

// 路由：获取一个商品
router.get("/product/:id", goodsController.getProduct);

// 路由：商品搜索
router.get("/search_goods", goodsController.findGoodsByName);

// 新品
router.get("/new_goods", goodsController.queryNewGoods);

// 商品销售量排序
router.get("/sales_goods", goodsController.querySalesGoods);

module.exports = router;

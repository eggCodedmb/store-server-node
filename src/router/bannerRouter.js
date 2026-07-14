const Router = require("koa-router");
const { auth, authorize } = require("../middleware/authMiddleware");
const {
  create,
  update,
  deleteBanner,
  findAll,
  findActive,
  getDetail,
} = require("../controller/bannerController");

const router = new Router({ prefix: "/banners" });

// 1. 公开接口：获取展示中的 Banner 列表 (免认证，供小程序首页调用)
router.get("/", findActive);

// 2. 后台管理接口：分页查询所有 Banner 列表
router.get("/list", auth, authorize("/banners/list", "GET"), findAll);

// 3. 后台管理接口：获取 Banner 详情
router.get("/:id", auth, authorize("/banners/:id", "GET"), getDetail);

// 4. 后台管理接口：创建 Banner
router.post("/", auth, authorize("/banners", "POST"), create);

// 5. 后台管理接口：更新 Banner
router.put("/:id", auth, authorize("/banners/:id", "PUT"), update);

// 6. 后台管理接口：删除 Banner
router.delete("/:id", auth, authorize("/banners/:id", "DELETE"), deleteBanner);

module.exports = router;

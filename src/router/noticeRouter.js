const Router = require("koa-router");
const { auth, authorize } = require("../middleware/authMiddleware");
const {
  create,
  update,
  deleteNotice,
  findAll,
  getDetail,
  getIcons,
} = require("../controller/noticeController");

const router = new Router({ prefix: "/notice" });

// 获取图标列表
router.get("/icons", auth, getIcons);

// 获取公告列表
router.get("/list", auth, findAll);
router.post("/list", auth, authorize("/notice/list", "POST"), findAll);

// 获取公告详情
router.get("/:id", auth, authorize("/notice/:id", "GET"), getDetail);

// 发布公告
router.post("/", auth, authorize("/notice", "POST"), create);

// 更新公告
router.put("/:id", auth, authorize("/notice/:id", "PUT"), update);

// 删除公告
router.delete("/:id", auth, authorize("/notice/:id", "DELETE"), deleteNotice);

module.exports = router;

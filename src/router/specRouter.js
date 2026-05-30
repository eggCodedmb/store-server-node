const Router = require("koa-router");
const { auth, authorize } = require("../middleware/authMiddleware");
const specController = require("../controller/specController");

const router = new Router({ prefix: "/specs" });

// 获取所有规格（包括选项）
router.get("/", auth, specController.findAll);

// 创建公共规格
router.post("/", auth, authorize(), specController.create);

// 修改公共规格
router.put("/:id", auth, authorize(), specController.update);

// 删除公共规格
router.delete("/:id", auth, authorize(), specController.delete);

module.exports = router;

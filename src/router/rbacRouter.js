const Router = require("koa-router");
const rbacController = require("../controller/rbacController");
const { auth, authorize } = require("../middleware/authMiddleware");

const router = new Router({ prefix: "/rbac" });

// 角色管理
router.get("/role", auth, rbacController.findAllRoles);
router.post("/role", auth, rbacController.createRole);
router.put("/role/:id", auth, rbacController.updateRole);
router.delete("/role/:id", auth, rbacController.deleteRole);
router.get("/role/:id/permissions", auth, rbacController.getRolePermissions);
router.post("/role/:id/permissions", auth, rbacController.assignPermissions);

// 权限/菜单管理
router.get("/permission", auth, rbacController.findAllPermissions);
router.post("/permission", auth, rbacController.createPermission);
router.put("/permission/:id", auth, rbacController.updatePermission);
router.delete("/permission/:id", auth, rbacController.deletePermission);

// 用户角色管理
router.get("/user/:id/roles", auth, rbacController.getUserRoles);
router.post("/user/:id/roles", auth, rbacController.assignUserRoles);

module.exports = router;

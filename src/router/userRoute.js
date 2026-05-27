const Router = require("koa-router");
// 导入控制器方法
const {
  register,
  login,
  changePassword,
  queryUserInfo,
  getAllUser,
  changeUser,
  getPermissions,
  wechatLogin,
} = require("../controller/userController");

// 导入中间件
const {
  verifyUserExists,
  BcryptPassword,
  verifyPassword,
  verifyUser,
  verifyEmailExists,
} = require("../middleware/userMiddleware");
const { validateParams } = require("../middleware/genericMiddleware");

// 中间件
const {
  auth,
  refreshToken,
  authorize,
} = require("../middleware/authMiddleware");

// 验证码中间件
const { validateCaptcha } = require("../middleware/captchaMiddleware");

// 错误类型
const { userFormateError } = require("../constant/errType");
// 规则
const {
  registerRules,
  adminAddUserRules,
  loginRules,
  updateUserRules: changeUserRules,
} = require("../constant/rules");

const router = new Router({ prefix: "/user" });

// 注册接口
// POST /user/register
router.post(
  "/register",
  validateParams(registerRules, userFormateError),
  validateCaptcha,
  verifyUserExists,
  verifyEmailExists,
  BcryptPassword,
  register
);

// 管理员添加用户接口 (无需验证码)
router.post(
  "/add",
  auth,
  authorize("/user/add", "POST"),
  validateParams(adminAddUserRules, userFormateError),
  verifyUserExists,
  verifyEmailExists,
  BcryptPassword,
  register
);

// 登录接口
router.post(
  "/login",
  validateParams(loginRules, userFormateError),
  validateCaptcha,
  verifyUser,
  verifyPassword,
  login
);

// 管理员登录接口
router.post(
  "/admin",
  validateParams(loginRules, userFormateError),
  verifyUser,
  verifyPassword,
  login
);

// 修改密码接口
router.patch("/change-password", auth, changePassword);

// 修改用户信息接口
router.patch(
  "/change-user",
  validateParams(changeUserRules, userFormateError),
  auth,
  changeUser
);

// 查询用户信息
router.post("/", auth, authorize("/user/", "POST"), queryUserInfo);

// 查询所有用户
// 使用 Casbin 权限校验替代简单的 verifAdmin
router.post("/all", auth, authorize("/user/all", "POST"), getAllUser);

// 刷新token接口
router.post("/refresh_token", refreshToken);

// 获取用户权限清单
router.get("/permissions", auth, getPermissions);

// 微信小程序登录
router.post("/wxlogin", wechatLogin);

// 导出路由模块
module.exports = router;

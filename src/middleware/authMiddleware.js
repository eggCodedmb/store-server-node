const { verifyToken, createToken } = require("../config/jwt");
const { JWT_SECRET } = require("../config/config.default"); // 导入 JWT 秘钥
const {
  TokenExpiredError,
  JsonWebTokenError,
  NullTokenError,
  refreshTokenError,
  serverError,
  forbiddenError,
} = require("../constant/errType"); // 导入错误类型
const { getEnforcer } = require("../utils/casbin");

/**
 * 验证用户身份的中间件
 */
const auth = async (ctx, next) => {
  try {
    const authorization = ctx.request.header?.authorization || "";

    if (!authorization) return ctx.app.emit("error", NullTokenError, ctx);

    const token = authorization.replace("Bearer ", "");

    // 解码
    const decoded = verifyToken(token, JWT_SECRET);

    ctx.state.user = decoded;
    await next();
  } catch (error) {
    switch (error.name) {
      case "TokenExpiredError":
        return ctx.app.emit("error", TokenExpiredError, ctx);
      case "JsonWebTokenError":
        return ctx.app.emit("error", JsonWebTokenError, ctx);
      default:
        JsonWebTokenError.message = error.message;
        return ctx.app.emit("error", JsonWebTokenError, ctx);
    }
  }
};

/**
 * Casbin 权限验证中间件
 * @param {string} [resource] 资源标识，如果不传则自动获取请求路径
 * @param {string} [action] 操作标识，如果不传则自动获取请求方法
 */
const authorize = (resource, action) => {
  return async (ctx, next) => {
    try {
      const { id } = ctx.state.user;
      const enforcer = await getEnforcer();

      // 如果没有指定资源和操作，则从请求中获取
      const obj = resource || ctx.path;
      const act = action || ctx.method;
      const sub = id.toString();

      const isAllowed = await enforcer.enforce(sub, obj, act);

      if (isAllowed) {
        await next();
      } else {
        ctx.app.emit("error", forbiddenError, ctx);
      }
    } catch (err) {
      console.error("Casbin Error:", err);
      ctx.app.emit("error", serverError, ctx);
    }
  };
};

/**
 * 令牌刷新
 * @returns
 */
const refreshToken = async (ctx, next) => {
  try {
    const { authorization } = ctx.request.header;

    if (!authorization) {
      return ctx.app.emit("error", NullTokenError, ctx);
    }

    const token = authorization.replace("Bearer ", "");

    const decoded = verifyToken(token, JWT_SECRET);

    ctx.state.user = decoded;
    // 刷新token
    const accessToken = await createToken(decoded, "1h");
    const refreshToken = await createToken(decoded, "1h");
    // 返回token
    ctx.body = {
      code: 0,
      message: "令牌刷新成功",
      result: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
    await next();
  } catch (error) {
    switch (error.name) {
      case "TokenExpiredError":
        return ctx.app.emit("error", refreshTokenError, ctx);
      case "JsonWebTokenError":
        return ctx.app.emit("error", JsonWebTokenError, ctx);
      default:
        JsonWebTokenError.message = "令牌错误";
        return ctx.app.emit("error", JsonWebTokenError, ctx);
    }
  }
};

module.exports = {
  auth,
  refreshToken,
  authorize,
};

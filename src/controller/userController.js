const {
  createUser,
  getUserInfo,
  updateById,
  findAllUser,
  findOrCreateByOpenid,
} = require("../service/userService");
const { createToken } = require("../config/jwt");
const https = require("https");
const { WX_APPID, WX_APPSECRET } = require("../config/config.default");
const {
  comparePassword,
  hashPassword,
} = require("../utils/passwordUtils/bcrypt");
const { Role } = require("../model/index");
const RbacService = require("../service/rbacService");
const {
  updateUserError,
  updatePasswordError,
  oldPasswordError,
  notUserExited,
  serverError,
} = require("../constant/errType");
const { getEnforcer } = require("../utils/casbin");

/**
 * 为用户分配默认角色 (内部辅助函数)
 */
async function assignDefaultRoleInternal(userId) {
  try {
    const commonRole = await Role.findOne({ where: { role_key: "common_user" } });
    if (commonRole) {
      await RbacService.assignRolesToUser(userId, [commonRole.id]);
    }
  } catch (error) {
    console.error("Assign Default Role Error:", error);
  }
}

class UserController {
  /**
   * 获取当前用户的权限清单
   */
  async getPermissions(ctx) {
    try {
      const { id } = ctx.state.user;
      const enforcer = await getEnforcer();
      const roles = await enforcer.getRolesForUser(id.toString());
      const permissions = await enforcer.getImplicitPermissionsForUser(id.toString());
      const userInfo = await getUserInfo({ id });
      const { password, ...user } = userInfo;

      const menus = [];
      const buttons = [];

      permissions.forEach((p) => {
        const [sub, obj, act] = p;
        if (act === "view") {
          menus.push(obj);
        } else if (act === "use") {
          buttons.push(obj);
        }
      });

      ctx.body = {
        code: 0,
        message: "获取权限成功",
        result: { user, roles, menus, buttons },
      };
    } catch (error) {
      console.error("Get Permissions Error:", error);
      ctx.app.emit("error", serverError, ctx);
    }
  }

  /**
   * 用户注册
   */
  async register(ctx) {
    try {
      const user = ctx.request.body;
      user.avatar = "http://47.119.172.215:9988/online/0008cbace240eee93a3327500.jpg";
      const { password, ...res } = await createUser(user);
      await assignDefaultRoleInternal(res.id);
      ctx.body = { code: 0, message: "用户注册成功", result: { user: res } };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 用户登录
   */
  async login(ctx) {
    try {
      const userInfo = ctx.request.body;
      const { password, ...user } = await getUserInfo(userInfo);
      const accessToken = createToken(user, "12h");
      const refreshToken = createToken(user, "30d");
      await updateById(user.id, {});
      ctx.body = {
        code: 0,
        message: "登录成功",
        result: { user, accessToken, refreshToken },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 微信小程序登录
   */
  async wechatLogin(ctx) {
    try {
      const { code, userInfo } = ctx.request.body;
      if (!code) {
        ctx.body = { code: "10010", message: "Missing code" };
        return;
      }

      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${WX_APPID}&secret=${WX_APPSECRET}&js_code=${code}&grant_type=authorization_code`;
      
      const wxRes = await new Promise((resolve, reject) => {
        https.get(url, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve(JSON.parse(data)));
        }).on("error", (err) => reject(err));
      });

      if (wxRes.errcode) {
        ctx.body = { code: wxRes.errcode, message: wxRes.errmsg };
        return;
      }

      const { openid, unionid } = wxRes;
      const user = await findOrCreateByOpenid(openid, { ...userInfo, unionid });
      
      // 异步分配角色，不阻塞主流程
      assignDefaultRoleInternal(user.id).catch(e => console.error("Async Role Assign failed:", e));

      const accessToken = createToken(user, "12h");
      const refreshToken = createToken(user, "30d");

      ctx.body = {
        code: 0,
        message: "微信登录成功",
        result: { user, accessToken, refreshToken },
      };
    } catch (error) {
      console.error("Wechat Login Exception:", error);
      ctx.body = {
        code: "10011",
        message: "微信登录失败",
        result: {
          msg: error.message,
          stack: error.stack,
          env: {
            hasAppId: !!WX_APPID,
            hasSecret: !!WX_APPSECRET
          }
        },
      };
    }
  }

  async changePassword(ctx) {
    try {
      const { id } = ctx.state.user;
      const { old_password, new_password } = ctx.request.body;
      const res = await getUserInfo({ id });
      const match = await comparePassword(old_password, res.password);
      if (match) {
        const hash_password = await hashPassword(new_password);
        await updateById(id, { password: hash_password });
        ctx.body = { code: 0, message: "修改密码成功", result: true };
      } else {
        ctx.app.emit("error", oldPasswordError, ctx);
      }
    } catch (error) {
      ctx.app.emit("error", updatePasswordError, ctx);
      throw error;
    }
  }

  async changeUser(ctx) {
    try {
      const { id } = ctx.state.user;
      const data = ctx.request.body;
      const res = await updateById(id, data);
      if (res) {
        const { password, ...userData } = await getUserInfo({ id });
        ctx.body = { code: 0, message: "修改信息成功", result: { user: userData } };
      } else {
        ctx.app.emit("error", updateUserError, ctx);
      }
    } catch (error) {
      ctx.app.emit("error", updateUserError, ctx);
      throw error;
    }
  }

  async queryUserInfo(ctx) {
    try {
      const { password, ...res } = await getUserInfo(ctx.request.body);
      if (!res) {
        ctx.app.emit("error", notUserExited, ctx);
      } else {
        ctx.body = { code: 0, message: "查询成功", result: { user: res } };
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllUser(ctx) {
    try {
      const {
        pageNum = 1,
        pageSize = 20,
        keyword,
        user_name,
        nick_name,
        email,
      } = ctx.request.body || {};
      const filters = {};
      if (keyword !== undefined && keyword !== "") filters.keyword = keyword;
      if (user_name !== undefined && user_name !== "") filters.user_name = user_name;
      if (nick_name !== undefined && nick_name !== "") filters.nick_name = nick_name;
      if (email !== undefined && email !== "") filters.email = email;
      const res = await findAllUser(pageSize, pageNum, filters);
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(ctx) {
    try {
      const { id } = ctx.params;
      const res = await require("../service/userService").removeUser(id);
      if (res) {
        ctx.body = { code: 0, message: "删除用户成功", result: "" };
      } else {
        ctx.app.emit("error", { code: "10110", message: "用户不存在" }, ctx);
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserController();

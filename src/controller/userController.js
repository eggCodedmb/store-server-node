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
} = require("../constant/errType");
const { getEnforcer } = require("../utils/casbin");
const User = require("../model/user/user");

class UseContrller {
  /**
   * 获取当前用户的权限清单（菜单、按钮、角色）
   */
  async getPermissions(ctx) {
    try {
      const { id } = ctx.state.user;
      const enforcer = await getEnforcer();

      // 获取用户拥有的所有角色
      const roles = await enforcer.getRolesForUser(id.toString());

      // 获取用户拥有的所有权限（包括继承自角色的）
      // getImplicitPermissionsForUser 会递归获取所有权限
      const permissions = await enforcer.getImplicitPermissionsForUser(
        id.toString()
      );

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
        result: {
          roles,
          menus,
          buttons,
        },
      };
    } catch (error) {
      console.error("Get Permissions Error:", error);
      ctx.app.emit("error", serverError, ctx);
    }
  }

  /**
   * 用户注册方法
   * @returns {Promise<void>}
   */
  async register(ctx) {
    try {
      //1.获取数据
      const user = ctx.request.body;
      user.avatar =
        "http://47.119.172.215:9988/online/0008cbace240eee93a3327500.jpg";
      //2.操作数据库
      const { password, ...res } = await createUser(user);

      // 3. 分配默认角色
      await this._assignDefaultRole(res.id);

      ctx.body = {
        code: 0,
        message: "用户注册成功",
        result: {
          user: res,
        },
      };
    } catch (error) {
      // 处理错误并抛出
      throw error;
    }
  }

  /**
   * 用户登录方法
   */
  async login(ctx) {
    try {
      // 获取用户信息
      const userInfo = ctx.request.body;
      const { password, ...user } = await getUserInfo(userInfo);

      // 刷新token
      const accessToken = createToken(user, "12h");
      const refreshToken = createToken(user, "12h");

      // 更新最后活跃时间 (通过触发 updatedAt)
      await updateById(user.id, {});

      // 返回数据
      ctx.body = {
        code: 0,
        message: "登录成功",
        result: {
          user: user,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      };
    } catch (error) {
      console.log(error);
      
      throw error;
    }
  }

  /**
   * 用户修改密码
   */
  async changePassword(ctx) {
    try {
      //1.获取数据
      const { id } = ctx.state.user;
      const { old_password, new_password } = ctx.request.body;
      const res = await getUserInfo({ id });
      const match = await comparePassword(old_password, res.password);

      if (match) {
        // 验证成功后进行加密
        const hash_password = await hashPassword(new_password);

        if (!hash_password) return;
        // 更新数据库
        const res = await updateById(id, { password: hash_password });
        ctx.body = {
          code: 0,
          message: "修改密码成功",
          result: res,
        };
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
        const { password, ...data } = await getUserInfo({ id });
        ctx.body = {
          code: 0,
          message: "修改信息成功",
          result: { user: data },
        };
      } else {
        ctx.app.emit("error", updateUserError, ctx);
      }
    } catch (error) {
      ctx.app.emit("error", updateUserError, ctx);
      throw error;
    }
  }
  /**
   * 查询用户
   * @param {*} ctx
   */
  async queryUserInfo(ctx) {
    try {
      const user = ctx.request.body;
      const { password, ...res } = await getUserInfo(user);

      if (!res) {
        ctx.app.emit("error", notUserExited, ctx);
      } else {
        ctx.body = {
          code: 0,
          message: "查询成功",
          result: { user: res },
        };
      }
    } catch (error) {
      throw error;
    }
  }

  // 获取所有用户的控制器
  async getAllUser(ctx) {
    try {
      const pageNum = ctx.request.body?.pageNum;
      const pageSize = ctx.request.body?.pageSize;
      const res = await findAllUser(pageSize, pageNum);
      ctx.body = {
        code: 0,
        message: "查询成功",
        result: res,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 删除用户
   */
  async deleteUser(ctx) {
    try {
      const { id } = ctx.params;
      const res = await require("../service/userService").removeUser(id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "删除用户成功",
          result: "",
        };
      } else {
        ctx.app.emit("error", { code: "10110", message: "用户不存在或删除失败" }, ctx);
      }
    } catch (error) {
      console.error("Delete User Error:", error);
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

      // 1. 调用微信 code2Session 接口
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${WX_APPID}&secret=${WX_APPSECRET}&js_code=${code}&grant_type=authorization_code`;
      
      const wxRes = await new Promise((resolve, reject) => {
        https.get(url, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve(JSON.parse(data)));
        }).on("error", (err) => reject(err));
      });

      if (wxRes.errcode) {
        ctx.body = {
          code: wxRes.errcode,
          message: wxRes.errmsg,
        };
        return;
      }

      const { openid, unionid } = wxRes;

      // 2. 登录或注册用户
      const user = await findOrCreateByOpenid(openid, { ...userInfo, unionid });

      // 3. 分配默认角色 (如果是新用户)
      await this._assignDefaultRole(user.id);

      // 4. 生成 Token
      const accessToken = createToken(user, "12h");
      const refreshToken = createToken(user, "30d");

      ctx.body = {
        code: 0,
        message: "微信登录成功",
        result: {
          user,
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      console.error("Wechat Login Error:", error);
      ctx.body = {
        code: "10011",
        message: "微信登录失败",
        result: error,
      };
    }
  }

  /**
   * 为用户分配默认角色 (common_user)
   * @param {number} userId 
   */
  async _assignDefaultRole(userId) {
    try {
      const commonRole = await Role.findOne({ where: { role_key: "common_user" } });
      if (commonRole) {
        // 使用 RbacService 分配角色，这会自动同步到 Casbin
        await RbacService.assignRolesToUser(userId, [commonRole.id]);
      }
    } catch (error) {
      console.error("Assign Default Role Error:", error);
    }
  }
}
module.exports = new UseContrller();

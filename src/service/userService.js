const User = require("../model/user/user");
const { Op } = require("sequelize");
const { Role } = require("../model/index");
class UserService {
  /**
   * 创建用户
   * @param {object} [user] - 用户
   * @returns {Promise<Object>} - 返回新创建用户的数据
   */
  async createUser(user) {
    // 插入数据到数据库
    const res = await User.create(user);
    // 返回新创建用户的数据
    return res.dataValues;
  }

  /**
   * 获取用户信息
   * @param {Object} user 用户
   * @returns {Promise<Object|null>} 返回用户数据或 null
   */
  async getUserInfo(user) {
    // 解构出信息，避免传入 undefined 时出错
    const { id, user_name, email } = user || {};

    const whereOpt = {
      ...(id && { id }),
      ...(email && { email }),
      ...(user_name && { user_name }),
    };

    // 判断如果是一个空对象，则返回
    if (Object.keys(whereOpt).length === 0) return;

    // 查询用户信息
    const res = await User.findOne({
      where: whereOpt,
    });
    // 返回查询结果
    return res?.dataValues || null;
  }

  /**
   * 根据 openid 查找或创建用户
   * @param {string} openid 微信 openid
   * @param {object} userInfo 用户额外信息 (如昵称、头像)
   */
  async findOrCreateByOpenid(openid, userInfo = {}) {
    const { nick_name, avatar, unionid } = userInfo;
    const [user, created] = await User.findOrCreate({
      where: { openid },
      defaults: {
        openid,
        unionid,
        nick_name: nick_name || `微信用户_${openid.slice(-6)}`,
        avatar: avatar || "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        user_name: `wx_${openid.slice(-10)}`,
        password: "", // 微信登录用户密码为空
        email: "",    // 微信登录用户邮箱为空
      },
    });
    return user.dataValues;
  }

  /**
   * 根据用户 ID 更新用户信息
   * @param {number} id 用户ID
   * @param {object} data 更新数据
   * @returns {Promise<boolean>} 返回更新是否成功
   */
  async updateById(id, data) {
    const { email, avatar, nick_name, password } = data || {};

    // 条件查询构建（自动忽略 undefined 的值）
    const userData = {
      ...(email && { email }),
      ...(avatar && { avatar }),
      ...(nick_name && { nick_name }),
      ...(password && { password }),
    };
    // 更新用户信息，返回更新操作的结果
    const res = await User.update(userData, { where: { id } });

    // 判断更新是否成功
    return res[0] > 0;
  }

  /**
   * 查询所有用户
   * @param {number} [pageSize=20] - 每页大小
   * @param {number} [pageNum=1] - 页码
   * @returns {Promise<Array<Object>>} - 返回用户数据数组
   */
  async findAllUser(pageSize = 20, pageNum = 1) {
    try {
      const offset = (pageNum - 1) * pageSize;
      const { count, rows } = await User.findAndCountAll({
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            attributes: ["id", "role_name", "role_key"],
            through: { attributes: [] },
          },
        ],
        limit: +pageSize,
        offset: +offset,
        order: [["createdAt", "DESC"]],
        distinct: true, // 确保 count 正确
      });

      return {
        pageNum: +pageNum,
        pageSize: +pageSize,
        total: count,
        users: rows,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 删除用户
   * @param {number} id 用户ID
   * @returns {Promise<boolean>} 返回删除是否成功
   */
  async removeUser(id) {
    const { getEnforcer } = require("../utils/casbin");
    const enforcer = await getEnforcer();

    // 1. 删除 Casbin 角色关系
    await enforcer.deleteRolesForUser(id.toString());
    await enforcer.savePolicy();

    // 2. 删除用户表记录 (会自动清理 UserRole 关联，如果设置了级联删除)
    // 如果没有设置级联删除，需要手动清理 UserRole
    const { UserRole } = require("../model/index");
    await UserRole.destroy({ where: { userId: id } });

    const res = await User.destroy({ where: { id } });
    return res > 0;
  }
}

module.exports = new UserService();

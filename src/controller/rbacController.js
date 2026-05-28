const rbacService = require("../service/rbacService");
const { Role, Permission, UserRole, RolePermission } = require("../model/index");

class RbacController {
  // --- 角色管理 ---
  async findAllRoles(ctx) {
    const res = await Role.findAll();
    ctx.body = { code: 0, message: "获取角色列表成功", result: res };
  }

  async createRole(ctx) {
    const { role_name, role_key, remark } = ctx.request.body;
    const res = await Role.create({ role_name, role_key, remark });
    ctx.body = { code: 0, message: "创建角色成功", result: res };
  }

  async updateRole(ctx) {
    const { id } = ctx.params;
    const { role_name, role_key, remark } = ctx.request.body;
    await Role.update({ role_name, role_key, remark }, { where: { id } });
    ctx.body = { code: 0, message: "更新角色成功" };
  }

  async deleteRole(ctx) {
    const { id } = ctx.params;
    await Role.destroy({ where: { id } });
    ctx.body = { code: 0, message: "删除角色成功" };
  }

  async getRolePermissions(ctx) {
    const { id } = ctx.params;
    const role = await Role.findByPk(id, {
      include: [{ model: Permission, through: { attributes: [] } }]
    });
    ctx.body = { code: 0, message: "获取角色权限成功", result: role.Permissions.map(p => p.id) };
  }

  async assignPermissions(ctx) {
    const { id } = ctx.params;
    const { permissionIds } = ctx.request.body;
    try {
      await rbacService.assignPermissionsToRole(id, permissionIds);
      ctx.body = { code: 0, message: "分配权限成功" };
    } catch (error) {
      // 保持 status 200，利用返回体内的 code 让前端拦截器正常读取 message 字段
      ctx.body = {
        code: "10004",
        message: error.message || "分配权限失败",
        result: ""
      };
    }
  }

  // --- 权限/菜单管理 ---
  async findAllPermissions(ctx) {
    const res = await Permission.findAll({ order: [['id', 'ASC']] });
    ctx.body = { code: 0, message: "获取权限列表成功", result: res };
  }

  async createPermission(ctx) {
    const res = await Permission.create(ctx.request.body);
    await rbacService.syncAllToCasbin();
    ctx.body = { code: 0, message: "创建权限成功", result: res };
  }

  async updatePermission(ctx) {
    const { id } = ctx.params;
    await Permission.update(ctx.request.body, { where: { id } });
    await rbacService.syncAllToCasbin();
    ctx.body = { code: 0, message: "更新权限成功" };
  }

  async deletePermission(ctx) {
    const { id } = ctx.params;
    await Permission.destroy({ where: { id } });
    await rbacService.syncAllToCasbin();
    ctx.body = { code: 0, message: "删除权限成功" };
  }

  // --- 用户角色分配 ---
  async getUserRoles(ctx) {
    const { id } = ctx.params;
    const res = await UserRole.findAll({ where: { userId: id } });
    ctx.body = { code: 0, message: "获取用户角色成功", result: res.map(r => r.roleId) };
  }

  async assignUserRoles(ctx) {
    const { id } = ctx.params;
    const { roleIds } = ctx.request.body;
    try {
      await rbacService.assignRolesToUser(id, roleIds);
      ctx.body = { code: 0, message: "分配角色成功" };
    } catch (error) {
      // 保持 status 200，利用返回体内的 code 让前端拦截器正常读取 message 字段
      ctx.body = {
        code: "10004",
        message: error.message === "用户不存在" ? "用户不存在" : (error.message || "分配角色失败"),
        result: ""
      };
    }
  }
}

module.exports = new RbacController();

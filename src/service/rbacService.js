const { Role, Permission, UserRole, RolePermission } = require("../model/index");
const { getEnforcer } = require("../utils/casbin");

class RbacService {
  /**
   * 同步所有物理权限数据到 Casbin
   */
  async syncAllToCasbin() {
    const enforcer = await getEnforcer();
    
    // 1. 清空当前所有策略 (谨慎使用，通常在初始化时使用)
    await enforcer.clearPolicy();

    // 2. 加载 角色-权限 关系
    const roles = await Role.findAll({
      include: [
        {
          model: Permission,
          through: { attributes: [] },
        },
      ],
    });

    for (const role of roles) {
      for (const perm of role.Permissions) {
        // p, role_key, path, method (如果是接口) 或 code (如果是菜单/按钮)
        // 这里我们统一逻辑：接口存 path+method，菜单/按钮存 code+type
        const obj = perm.type === 3 ? perm.path : perm.code;
        const act = perm.type === 3 ? perm.method : (perm.type === 1 ? 'view' : 'use');
        
        if (obj && act) {
          await enforcer.addPolicy(role.role_key, obj, act);
        }
      }
    }

    // 3. 加载 用户-角色 关系
    const userRoles = await UserRole.findAll();
    for (const ur of userRoles) {
      const role = await Role.findByPk(ur.roleId);
      if (role) {
        await enforcer.addRoleForUser(ur.userId.toString(), role.role_key);
      }
    }

    await enforcer.savePolicy();
    console.log("RBAC 数据已成功同步至 Casbin");
  }

  /**
   * 为角色分配权限
   */
  async assignPermissionsToRole(roleId, permissionIds) {
    // 1. 更新物理表
    await RolePermission.destroy({ where: { roleId } });
    const mapping = permissionIds.map(permId => ({ roleId, permissionId: permId }));
    await RolePermission.bulkCreate(mapping);

    // 2. 同步到 Casbin
    await this.syncAllToCasbin();
  }

  /**
   * 为用户分配角色
   */
  async assignRolesToUser(userId, roleIds) {
    // 1. 更新物理表
    await UserRole.destroy({ where: { userId } });
    const mapping = roleIds.map(roleId => ({ userId, roleId }));
    await UserRole.bulkCreate(mapping);

    // 2. 同步到 Casbin
    await this.syncAllToCasbin();
  }
}

module.exports = new RbacService();

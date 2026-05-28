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
    const seq = require("../db/seq");
    
    await seq.transaction(async (t) => {
      // 1. 更新物理表
      await RolePermission.destroy({ where: { roleId }, transaction: t });
      
      if (permissionIds && permissionIds.length > 0) {
        const mapping = permissionIds.map(permId => ({ roleId, permissionId: permId }));
        await RolePermission.bulkCreate(mapping, { transaction: t });
      }

      // 2. 同步到 Casbin
      // 这里调用 syncAllToCasbin，它内部不使用当前事务，但如果它抛错，物理事务会回滚
      await this.syncAllToCasbin();
    });
  }

  /**
   * 为用户分配角色
   */
  async assignRolesToUser(userId, roleIds = []) {
    const seq = require("../db/seq");
    const enforcer = await getEnforcer();
    
    await seq.transaction(async (t) => {
      // 1. 更新物理表
      const uId = parseInt(userId);
      
      // 检查用户是否存在
      const { User } = require("../model/index");
      const user = await User.findByPk(uId, { transaction: t });
      if (!user) {
        throw new Error("用户不存在");
      }
      
      await UserRole.destroy({ where: { userId: uId }, transaction: t });
      
      if (roleIds && roleIds.length > 0) {
        // 验证角色是否存在
        const existingRoles = await Role.findAll({ where: { id: roleIds }, transaction: t });
        const existingRoleIds = existingRoles.map(r => r.id);
        
        if (existingRoleIds.length > 0) {
          const mapping = existingRoleIds.map(roleId => ({ userId: uId, roleId }));
          await UserRole.bulkCreate(mapping, { transaction: t });
        }
      }

      // 2. 更新 Casbin
      await enforcer.deleteRolesForUser(userId.toString());
      
      if (roleIds && roleIds.length > 0) {
        // 再次获取角色信息以确保拿到最新的 role_key
        const roles = await Role.findAll({ where: { id: roleIds }, transaction: t });
        for (const role of roles) {
          await enforcer.addRoleForUser(userId.toString(), role.role_key);
        }
      }

      await enforcer.savePolicy();
    });
    
    console.log(`用户 ${userId} 的角色已更新并同步至 Casbin`);
  }
}

module.exports = new RbacService();

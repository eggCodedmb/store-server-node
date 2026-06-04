const { Role, Permission, CheckinReward, CheckinRecord } = require("../model/index");
const RbacService = require("../service/rbacService");

/**
 * 增量初始化签到功能（应用启动时调用）
 * 1. 自动创建签到相关数据表（如不存在）
 * 2. 初始化签到管理权限
 */
const seedCheckinPermissions = async () => {
  try {
    // 1. 自动创建签到数据表（如不存在则创建，已存在则跳过）
    await CheckinReward.sync();
    await CheckinRecord.sync();
    console.log("[签到初始化] 数据表同步完成");

    // 2. 创建菜单权限
    const [menuPerm] = await Permission.findOrCreate({
      where: { code: "/checkin_manage" },
      defaults: {
        name: "活动管理",
        code: "/checkin_manage",
        type: 1,
        parent_id: 0,
      },
    });

    // 2. 创建接口权限
    const apiPerms = [
      {
        name: "查询签到奖励配置接口",
        code: "api:checkin:rewards_get",
        type: 3,
        path: "/checkin/rewards",
        method: "GET",
        parent_id: menuPerm.id,
      },
      {
        name: "更新签到奖励配置接口",
        code: "api:checkin:rewards_put",
        type: 3,
        path: "/checkin/rewards",
        method: "PUT",
        parent_id: menuPerm.id,
      },
      {
        name: "查询签到记录接口",
        code: "api:checkin:records",
        type: 3,
        path: "/checkin/records",
        method: "GET",
        parent_id: menuPerm.id,
      },
    ];

    for (const p of apiPerms) {
      await Permission.findOrCreate({
        where: { code: p.code },
        defaults: p,
      });
    }

    // 3. 为 admin 角色分配这些权限
    const adminRole = await Role.findOne({ where: { role_key: "admin" } });
    if (adminRole) {
      const allCheckinPerms = await Permission.findAll({
        where: {
          code: ["/checkin_manage", "api:checkin:rewards_get", "api:checkin:rewards_put", "api:checkin:records"],
        },
      });

      if (allCheckinPerms.length > 0) {
        const existingPerms = await adminRole.getPermissions();
        const existingIds = new Set(existingPerms.map((p) => p.id));
        const newPerms = allCheckinPerms.filter((p) => !existingIds.has(p.id));

        if (newPerms.length > 0) {
          await adminRole.addPermissions(newPerms);
          console.log(`[签到权限] 已为 admin 角色分配 ${newPerms.length} 个新权限`);
        }
      }
    }

    // 4. 同步到 Casbin
    await RbacService.syncAllToCasbin();
    console.log("[签到权限] 初始化完成");
  } catch (error) {
    console.error("[签到权限] 初始化失败:", error.message);
  }
};

module.exports = { seedCheckinPermissions };

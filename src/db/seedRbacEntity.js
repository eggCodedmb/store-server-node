const { Role, Permission, User } = require("../model/index");
const RbacService = require("../service/rbacService");
const { hashPassword } = require("../utils/passwordUtils/bcrypt");

const seedRBAC = async () => {
  try {
    console.log("正在初始化 RBAC 物理数据...");

    // 1. 创建角色
    const [adminRole] = await Role.findOrCreate({
      where: { role_key: "admin" },
      defaults: { role_name: "超级管理员", remark: "拥有所有权限" },
    });

    const [userRole] = await Role.findOrCreate({
      where: { role_key: "common_user" },
      defaults: { role_name: "普通用户", remark: "仅拥有基础查看权限" },
    });

    // 2. 创建权限点
    const permsData = [
      // 菜单
      { name: "控制台", code: "/dashboard", type: 1 },
      { name: "用户管理", code: "/user_manage", type: 1 },
      { name: "商品管理", code: "/goods_manage", type: 1 },
      // 按钮
      { name: "添加用户按钮", code: "user:add_btn", type: 2 },
      { name: "删除用户按钮", code: "user:delete_btn", type: 2 },
      // 接口
      { name: "查询用户接口", code: "api:user:all", type: 3, path: "/user/all", method: "POST" },
      { name: "创建用户接口", code: "api:user:add", type: 3, path: "/user/add", method: "POST" },
      { name: "修改密码接口", code: "api:user:change-password", type: 3, path: "/user/change-password", method: "PATCH" },
    ];

    const createdPerms = [];
    for (const p of permsData) {
      const [perm] = await Permission.findOrCreate({
        where: { code: p.code },
        defaults: p,
      });
      createdPerms.push(perm);
    }

    // 3. 为 Admin 分配所有权限
    await adminRole.setPermissions(createdPerms);

    // 4. 为普通用户分配基础权限 (比如控制台和修改密码)
    const basicPerms = createdPerms.filter(p => ["/dashboard", "api:user:change-password"].includes(p.code));
    await userRole.setPermissions(basicPerms);

    // 5. 确保有一个测试用户 (ID: 1) 并分配 Admin 角色
    let testUser = await User.findByPk(1);
    if (!testUser) {
      const hp = await hashPassword("123456");
      testUser = await User.create({
        user_name: "admin",
        password: hp,
        nick_name: "管理员",
        email: "admin@example.com",
        avatar: "http://example.com/avatar.jpg"
      });
    }
    await testUser.setRoles([adminRole]);

    // 6. 同步到 Casbin
    await RbacService.syncAllToCasbin();

    console.log("RBAC 物理数据初始化及同步完成！");
    process.exit(0);
  } catch (err) {
    console.error("RBAC 初始化失败:", err);
    process.exit(1);
  }
};

seedRBAC();

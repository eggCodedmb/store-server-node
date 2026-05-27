const { User, Role, Permission } = require("../model/index");
const RbacService = require("../service/rbacService");
const { hashPassword } = require("../utils/passwordUtils/bcrypt");

const initAdmin = async () => {
  try {
    console.log("开始生成超级管理员账号...");

    // 1. 确保超级管理员角色存在
    const [adminRole] = await Role.findOrCreate({
      where: { role_key: "admin" },
      defaults: {
        role_name: "超级管理员",
        remark: "系统最高权限，拥有所有操作权限",
        status: true
      }
    });
    console.log("1. 角色检查完成: admin");

    // 2. 获取系统中定义的所有权限点
    const allPermissions = await Permission.findAll();
    if (allPermissions.length === 0) {
      console.log("警告: 系统中尚未定义任何权限点，请先运行权限种子脚本。");
    } else {
      // 为管理员分配所有权限
      await adminRole.setPermissions(allPermissions);
      console.log(`2. 已为管理员角色分配 ${allPermissions.length} 个权限点`);
    }

    // 3. 确保 admin 用户存在
    let adminUser = await User.findOne({ where: { user_name: "admin" } });
    const hashedPassword = await hashPassword("123456");

    if (!adminUser) {
      adminUser = await User.create({
        user_name: "admin",
        password: hashedPassword,
        nick_name: "超级管理员",
        email: "admin@example.com",
        avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" // Element UI 默认头像
      });
      console.log("3. 超级管理员用户创建成功");
    } else {
      // 如果用户已存在，更新密码确保可以登录
      await adminUser.update({ password: hashedPassword });
      console.log("3. 超级管理员用户已存在，密码已重置为: 123456");
    }

    // 4. 将 admin 用户关联到 admin 角色
    await adminUser.setRoles([adminRole]);
    console.log("4. 用户与角色关联完成");

    // 5. 同步数据到 Casbin 引擎
    await RbacService.syncAllToCasbin();
    console.log("5. 权限策略已同步至 Casbin 引擎");

    console.log("\n========================================");
    console.log("超级管理员账号初始化成功！");
    console.log("用户名: admin");
    console.log("密  码: 123456");
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("生成超级管理员失败:", error);
    process.exit(1);
  }
};

initAdmin();

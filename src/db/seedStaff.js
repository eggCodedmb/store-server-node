const { User, Role, Store, UserStore, UserRole } = require("../model/index");
const { hashPassword } = require("../utils/passwordUtils/bcrypt");

const seedStaff = async () => {
  try {
    console.log("开始生成员工和店长数据...");

    // 1. 确保角色存在
    const [managerRole] = await Role.findOrCreate({
      where: { role_key: "manager" },
      defaults: { role_name: "店长", remark: "门店负责人，负责管理门店商品和订单" }
    });
    const [staffRole] = await Role.findOrCreate({
      where: { role_key: "staff" },
      defaults: { role_name: "店员", remark: "普通店员，负责核销和日常操作" }
    });
    console.log("角色检查/创建完成");

    // 获取所有门店
    const allStores = await Store.findAll();
    if (allStores.length === 0) {
      console.error("未找到任何门店，请先生成门店数据！");
      process.exit(1);
    }

    const defaultPassword = await hashPassword("123456");

    // 2. 生成 5 个店长
    console.log("正在生成 5 个店长...");
    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        user_name: `manager${i}`,
        nick_name: `店长${i}号`,
        password: defaultPassword,
        email: `manager${i}@example.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=manager${i}`
      });
      // 分配角色
      await user.addRole(managerRole);
      // 随机分配 1 个门店
      const randomStore = allStores[Math.floor(Math.random() * allStores.length)];
      await user.setDepartments([randomStore]);
    }

    // 3. 生成 10 个店员
    console.log("正在生成 10 个店员...");
    for (let i = 1; i <= 10; i++) {
      const user = await User.create({
        user_name: `staff${i}`,
        nick_name: `店员${i}号`,
        password: defaultPassword,
        email: `staff${i}@example.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=staff${i}`
      });
      // 分配角色
      await user.addRole(staffRole);
      // 随机分配 1 个门店
      const randomStore = allStores[Math.floor(Math.random() * allStores.length)];
      await user.setDepartments([randomStore]);
    }

    console.log("员工和店长数据生成完毕！");
    process.exit(0);
  } catch (error) {
    console.error("生成数据失败:", error);
    process.exit(1);
  }
};

seedStaff();

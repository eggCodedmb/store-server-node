const { getEnforcer } = require('../utils/casbin');

const seed = async () => {
  const enforcer = await getEnforcer();

  // 1. 定义角色继承关系
  // 'admin' 继承 'user' 角色 (可选)
  // await enforcer.addRoleForUser('admin', 'user');

  // 2. 为 admin 角色分配 API 权限
  await enforcer.addPolicy('admin', '/user/all', 'POST');
  await enforcer.addPolicy('admin', '/user/', 'POST');
  
  // 3. 为 admin 角色分配前端 Menu 权限 (act 为 view)
  await enforcer.addPolicy('admin', '/dashboard', 'view');
  await enforcer.addPolicy('admin', '/user_manage', 'view');
  await enforcer.addPolicy('admin', '/goods_manage', 'view');

  // 4. 为 admin 角色分配前端 Button 权限 (act 为 use)
  await enforcer.addPolicy('admin', 'user:add_btn', 'use');
  await enforcer.addPolicy('admin', 'user:delete_btn', 'use');

  // 5. 将特定用户 (假设 ID 为 1) 设为 admin
  // 注意：在实际业务中，这应该通过后台管理界面完成
  await enforcer.addRoleForUser('1', 'admin');

  console.log('Casbin 权限数据初始化成功！');
  process.exit(0);
};

seed().catch(err => {
  console.error('初始化失败:', err);
  process.exit(1);
});

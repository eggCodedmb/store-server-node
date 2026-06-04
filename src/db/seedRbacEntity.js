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

    // 2. 创建权限点
    const permsData = [
      // 菜单 (Type: 1)
      { name: "控制台", code: "/dashboard", type: 1, parent_id: 0 },
      { name: "用户管理", code: "/user_manage", type: 1, parent_id: 0 },
      { name: "分类管理", code: "/category_manage", type: 1, parent_id: 0 },
      { name: "商品管理", code: "/goods_manage", type: 1, parent_id: 0 },
      { name: "订单管理", code: "/order_manage", type: 1, parent_id: 0 },
      { name: "地址管理", code: "/address_manage", type: 1, parent_id: 0 },
      { name: "门店管理", code: "/store_manage", type: 1, parent_id: 0 },
      { name: "优惠券管理", code: "/coupon_manage", type: 1, parent_id: 0 },
      { name: "活动管理", code: "/checkin_manage", type: 1, parent_id: 0 },
      { name: "系统管理", code: "/system", type: 1, parent_id: 0 },
      { name: "角色管理", code: "/system/role", type: 1, parent_id: 8 }, // 根据顺序更新ID
      { name: "菜单管理", code: "/system/menu", type: 1, parent_id: 8 },
      { name: "公告管理", code: "/system/notice", type: 1, parent_id: 8 },
      
      // 按钮 (Type: 2)
      { name: "添加商品按钮", code: "goods:add_btn", type: 2, parent_id: 4 },
      { name: "编辑商品按钮", code: "goods:edit_btn", type: 2, parent_id: 4 },
      { name: "下架商品按钮", code: "goods:delete_btn", type: 2, parent_id: 4 },
      { name: "编辑门店按钮", code: "goods:edit_store", type: 2, parent_id: 4 },
      { name: "权限分配按钮", code: "user:assign_role_btn", type: 2, parent_id: 2 },
      { name: "分配权限按钮", code: "role:assign_perm_btn", type: 2, parent_id: 9 }, // system/role 的 id 是 9
      { name: "添加优惠券按钮", code: "coupon:add_btn", type: 2, parent_id: 8 },
      { name: "编辑优惠券按钮", code: "coupon:edit_btn", type: 2, parent_id: 8 },
      
      // 接口 (Type: 3)
      { name: "查询商品接口", code: "api:goods:all", type: 3, path: "/goods/", method: "GET", parent_id: 4 },
      { name: "创建商品接口", code: "api:goods:create", type: 3, path: "/goods/", method: "POST", parent_id: 4 },
      { name: "编辑商品接口", code: "api:goods:update", type: 3, path: "/goods/:id", method: "PUT", parent_id: 4 },
      { name: "下架商品接口", code: "api:goods:off", type: 3, path: "/goods/off", method: "POST", parent_id: 4 },
      { name: "上架商品接口", code: "api:goods:on", type: 3, path: "/goods/on", method: "POST", parent_id: 4 },
      { name: "查询下架商品接口", code: "api:goods:removal", type: 3, path: "/goods/removal", method: "POST", parent_id: 4 },
      { name: "查询分类接口", code: "api:category:all", type: 3, path: "/category/", method: "GET", parent_id: 3 },
      { name: "创建分类接口", code: "api:category:create", type: 3, path: "/category/", method: "POST", parent_id: 3 },
      { name: "更新分类接口", code: "api:category:update", type: 3, path: "/category/:id", method: "PUT", parent_id: 3 },
      { name: "删除分类接口", code: "api:category:delete", type: 3, path: "/category/:id", method: "DELETE", parent_id: 3 },
      { name: "分类添加商品接口", code: "api:category:add_goods", type: 3, path: "/category/:id/goods", method: "POST", parent_id: 3 },
      { name: "分类移除商品接口", code: "api:category:remove_goods", type: 3, path: "/category/:id/goods", method: "DELETE", parent_id: 3 },
      { name: "查询订单接口", code: "api:order:all", type: 3, path: "/order", method: "POST", parent_id: 5 },
      { name: "删除订单接口", code: "api:order:delete", type: 3, path: "/order/:id", method: "DELETE", parent_id: 5 },
      { name: "修改订单状态接口", code: "api:order:update", type: 3, path: "/order/:id", method: "PATCH", parent_id: 5 },
      { name: "查询地址接口", code: "api:address:all", type: 3, path: "/address/findAll", method: "POST", parent_id: 6 },
      { name: "查询门店接口", code: "api:store:all", type: 3, path: "/store/list", method: "GET", parent_id: 7 },
      { name: "创建门店接口", code: "api:store:create", type: 3, path: "/store", method: "POST", parent_id: 7 },
      { name: "更新门店接口", code: "api:store:update", type: 3, path: "/store/:id", method: "PUT", parent_id: 7 },
      { name: "删除门店接口", code: "api:store:delete", type: 3, path: "/store/:id", method: "DELETE", parent_id: 7 },
      
      // 统计接口 (Dashboard)
      { name: "首页概览统计接口", code: "api:tj:summary", type: 3, path: "/tj/summary", method: "GET", parent_id: 1 },
      { name: "用户统计接口", code: "api:tj:user_count", type: 3, path: "/tj/user-count", method: "POST", parent_id: 1 },
      { name: "商品统计接口", code: "api:tj:goods_count", type: 3, path: "/tj/goods-count", method: "POST", parent_id: 1 },
      { name: "订单统计接口", code: "api:tj:order_count", type: 3, path: "/tj/order-count", method: "POST", parent_id: 1 },
      { name: "销售趋势接口", code: "api:tj:sales_trend", type: 3, path: "/tj/sales-trend", method: "GET", parent_id: 1 },
      { name: "分类分布接口", code: "api:tj:category_distribution", type: 3, path: "/tj/category-distribution", method: "GET", parent_id: 1 },
      { name: "最近订单接口", code: "api:tj:recent_orders", type: 3, path: "/tj/recent-orders", method: "GET", parent_id: 1 },

      // 用户管理更多接口
      { name: "查询所有用户接口", code: "api:user:all", type: 3, path: "/user/all", method: "POST", parent_id: 2 },
      { name: "管理员添加用户接口", code: "api:user:add", type: 3, path: "/user/add", method: "POST", parent_id: 2 },
      { name: "删除用户接口", code: "api:user:delete", type: 3, path: "/user/:id", method: "DELETE", parent_id: 2 },

      // 公告管理接口
      { name: "查询公告接口", code: "api:notice:list", type: 3, path: "/notice/list", method: "POST", parent_id: 10 },
      { name: "发布公告接口", code: "api:notice:create", type: 3, path: "/notice", method: "POST", parent_id: 10 },
      { name: "更新公告接口", code: "api:notice:update", type: 3, path: "/notice/:id", method: "PUT", parent_id: 10 },
      { name: "删除公告接口", code: "api:notice:delete", type: 3, path: "/notice/:id", method: "DELETE", parent_id: 10 },

      { name: "所有接口权限", code: "api:all", type: 3, path: "*", method: "*", parent_id: 0 },

      // 优惠券管理接口
      { name: "查询优惠券模板接口", code: "api:coupon:list", type: 3, path: "/coupon/template", method: "GET", parent_id: 8 },
      { name: "创建优惠券模板接口", code: "api:coupon:create", type: 3, path: "/coupon/template", method: "POST", parent_id: 8 },
      { name: "更新优惠券模板接口", code: "api:coupon:update", type: 3, path: "/coupon/template/:id", method: "PUT", parent_id: 8 },
      { name: "停用优惠券模板接口", code: "api:coupon:delete", type: 3, path: "/coupon/template/:id", method: "DELETE", parent_id: 8 },
      { name: "查看领取记录接口", code: "api:coupon:records", type: 3, path: "/coupon/template/:id/records", method: "GET", parent_id: 8 },

      // 签到管理接口
      { name: "查询签到奖励配置接口", code: "api:checkin:rewards_get", type: 3, path: "/checkin/rewards", method: "GET", parent_id: 9 },
      { name: "更新签到奖励配置接口", code: "api:checkin:rewards_put", type: 3, path: "/checkin/rewards", method: "PUT", parent_id: 9 },
      { name: "查询签到记录接口", code: "api:checkin:records", type: 3, path: "/checkin/records", method: "GET", parent_id: 9 },
    ];

    const createdPerms = [];
    for (const p of permsData) {
      const [perm] = await Permission.findOrCreate({
        where: { code: p.code },
        defaults: p,
      });
      createdPerms.push(perm);
    }

    // 动态校准 parent_id 关系
    const findId = (code) => createdPerms.find(p => p.code === code)?.id || 0;
    
    const relations = [
      { parent: "/dashboard", children: ["api:tj:summary", "api:tj:user_count", "api:tj:goods_count", "api:tj:order_count", "api:tj:sales_trend", "api:tj:category_distribution", "api:tj:recent_orders"] },
      { parent: "/system", children: ["/system/role", "/system/menu", "/system/notice"] },
      { parent: "/user_manage", children: ["user:assign_role_btn", "api:user:all", "api:user:add", "api:user:delete"] },
      { parent: "/goods_manage", children: ["goods:add_btn", "goods:edit_btn", "goods:delete_btn", "goods:edit_store", "api:goods:all", "api:goods:create", "api:goods:update", "api:goods:off", "api:goods:on", "api:goods:removal"] },
      { parent: "/category_manage", children: ["api:category:all", "api:category:create", "api:category:update", "api:category:delete", "api:category:add_goods", "api:category:remove_goods"] },
      { parent: "/order_manage", children: ["api:order:all", "api:order:delete", "api:order:update"] },
      { parent: "/system/notice", children: ["api:notice:list", "api:notice:create", "api:notice:update", "api:notice:delete"] },
      { parent: "/address_manage", children: ["api:address:all"] },
      { parent: "/store_manage", children: ["api:store:all", "api:store:create", "api:store:update", "api:store:delete"] },
      { parent: "/coupon_manage", children: ["coupon:add_btn", "coupon:edit_btn", "api:coupon:list", "api:coupon:create", "api:coupon:update", "api:coupon:delete", "api:coupon:records"] },
      { parent: "/checkin_manage", children: ["api:checkin:rewards_get", "api:checkin:rewards_put", "api:checkin:records"] },
    ];

    for (const rel of relations) {
      const pId = findId(rel.parent);
      if (pId) {
        await Permission.update({ parent_id: pId }, { where: { code: rel.children } });
      }
    }

    // 3. 为 Admin 分配所有权限
    const allPerms = await Permission.findAll();
    await adminRole.setPermissions(allPerms);

    // 4. 同步到 Casbin
    await RbacService.syncAllToCasbin();

    console.log("RBAC 数据更新完成！");
    process.exit(0);
  } catch (err) {
    console.error("RBAC 初始化失败:", err);
    process.exit(1);
  }
};

seedRBAC();

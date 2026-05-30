const { User, Store, Goods, Category, UserStore } = require("../model/index");
const { hashPassword } = require("../utils/passwordUtils/bcrypt");

const seedData = async () => {
  try {
    console.log("开始生成种子数据...");

    // 1. 生成 20 个门店
    const stores = [];
    for (let i = 1; i <= 20; i++) {
      stores.push({
        name: `测试门店 ${i.toString().padStart(2, '0')}`,
        description: `这是第 ${i} 个自动化生成的测试门店，主要用于展示门店管理功能。`,
        address: `上海市浦东新区某某路 ${100 + i} 号`,
        business_hours: JSON.stringify(["08:00-12:00", "14:00-22:00"]),
        longitude: 121.4737 + (Math.random() - 0.5) * 0.1,
        latitude: 31.2304 + (Math.random() - 0.5) * 0.1,
        phone: `138${Math.floor(Math.random() * 90000000 + 10000000)}`,
        logo: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        user_id: 1, // 关联超级管理员
      });
    }
    const createdStores = await Store.bulkCreate(stores);
    console.log(`成功创建 ${createdStores.length} 个门店`);

    // 2. 生成 5 个分类
    const categories = [
      { category_name: "热销推荐", order_num: 1, description: "店内主打，必点系列" },
      { category_name: "精品奶茶", order_num: 2, description: "经典醇香，回味无穷" },
      { category_name: "鲜果茶", order_num: 3, description: "新鲜水果，现泡好茶" },
      { category_name: "咖啡系列", order_num: 4, description: "提神醒脑，醇厚口感" },
      { category_name: "精选小吃", order_num: 5, description: "茶点搭配，美味加倍" },
    ];
    const createdCategories = await Category.bulkCreate(categories);
    console.log(`成功创建 ${createdCategories.length} 个分类`);

    // 3. 生成 20 个商品 (均匀分配到不同门店和分类)
    const goods = [];
    const goodsNames = [
      "招牌珍珠奶茶", "杨枝甘露", "多肉葡萄", "冰鲜柠檬水", "芝芝莓莓",
      "美式咖啡", "生椰拿铁", "燕麦拿铁", "卡布奇诺", "摩卡",
      "黄金脆薯", "奥尔良烤翅", "爆米花", "红豆派", "鸡米花",
      "抹茶拿铁", "满杯红柚", "四季春青茶", "茉莉毛峰", "炭焙乌龙"
    ];

    for (let i = 0; i < 20; i++) {
      // 每个商品随机分配到一个门店
      const randomStore = createdStores[Math.floor(Math.random() * createdStores.length)];
      goods.push({
        goods_name: goodsNames[i] || `测试商品 ${i + 1}`,
        goods_price: (10 + Math.random() * 20).toFixed(2),
        goods_num: 999,
        store_id: randomStore.id,
        goods_img: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      });
    }
    const createdGoods = await Goods.bulkCreate(goods);
    console.log(`成功创建 ${createdGoods.length} 个商品`);

    // 4. 为每个商品随机分配 1-2 个分类
    for (const g of createdGoods) {
      const shuffled = createdCategories.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 1);
      await g.setCategories(selected);
    }
    console.log("商品分类关联完成");

    // 5. 为 admin 用户分配所有生成的门店 (部门)
    const adminUser = await User.findByPk(1);
    if (adminUser) {
      await adminUser.setDepartments(createdStores);
      console.log("已为 admin 用户分配所有生成门店的部门权限");
    }

    console.log("种子数据生成完毕！");
    process.exit(0);
  } catch (error) {
    console.error("生成数据失败:", error);
    process.exit(1);
  }
};

seedData();

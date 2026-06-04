const {
  User,
  Store,
  StorePhoto,
  UserStore,
  Goods,
  Cart,
  Address,
  Order,
  OrderItem,
  Role,
  Permission,
  UserRole,
  RolePermission,
  Category,
  GoodsCategory,
  SpecGroup,
  SpecOption,
  Topping,
  ProductSpecRel,
  Notice,
  CouponTemplate,
  UserCoupon,
  CheckinReward,
  CheckinRecord,
} = require("./index");
const seq = require("../db/seq");

// 同步模型
const syncModels = async () => {
  try {
    // 禁用外键检查，以便顺利删除和重建表
    await seq.query("SET FOREIGN_KEY_CHECKS = 0");

    // 1. 同步基础模型
    await User.sync({ force: true });
    await Store.sync({ force: true });
    await StorePhoto.sync({ force: true });
    await UserStore.sync({ force: true });
    await Goods.sync({ force: true });
    await Permission.sync({ force: true });
    await Role.sync({ force: true });
    await Category.sync({ force: true });
    await Notice.sync({ force: true });
    await SpecGroup.sync({ force: true });
    await Topping.sync({ force: true });

    // 2. 同步映射表和依赖表
    await UserRole.sync({ force: true });
    await RolePermission.sync({ force: true });
    await GoodsCategory.sync({ force: true });
    await SpecOption.sync({ force: true });
    await ProductSpecRel.sync({ force: true });

    // 3. 同步优惠券模板（在 Order 之前，Order 依赖它）
    await CouponTemplate.sync({ force: true });

    // 3.5 同步签到奖励配置（依赖 CouponTemplate）
    await CheckinReward.sync({ force: true });

    // 4. 同步业务模型
    await Address.sync({ force: true });
    await Cart.sync({ force: true });
    await Order.sync({ force: true });
    await OrderItem.sync({ force: true });
    await UserCoupon.sync({ force: true });
    await CheckinRecord.sync({ force: true });

    // 重新启用外键检查
    await seq.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("所有模型同步完成");
  } catch (error) {
    await seq.query("SET FOREIGN_KEY_CHECKS = 1");
    console.error("同步模型时出错:", error);
  }
};

// 删除所有模型
const dropModels = async () => {
  try {
    await seq.query("SET FOREIGN_KEY_CHECKS = 0");
    await CheckinRecord.drop();
    await CheckinReward.drop();
    await UserCoupon.drop();
    await OrderItem.drop();
    await Order.drop();
    await Cart.drop();
    await Address.drop();
    await CouponTemplate.drop();
    await ProductSpecRel.drop();
    await SpecOption.drop();
    await Topping.drop();
    await SpecGroup.drop();
    await GoodsCategory.drop();
    await RolePermission.drop();
    await UserRole.drop();
    await Category.drop();
    await Role.drop();
    await Permission.drop();
    await Goods.drop();
    await UserStore.drop();
    await StorePhoto.drop();
    await Store.drop();
    await User.drop();
    await Notice.drop();
    await seq.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("所有模型删除成功");
  } catch (error) {
    await seq.query("SET FOREIGN_KEY_CHECKS = 1");
    console.error("删除模型时出错:", error);
  }
};

module.exports = { syncModels, dropModels };

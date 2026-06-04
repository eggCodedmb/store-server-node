const User = require("./user/user");
const Goods = require("./product/goods");
const Cart = require("./cart/cart");
const Address = require("./address/address");
const Order = require("./order/order");
const OrderItem = require("./order/orderItem");
const Category = require("./product/category");
const GoodsCategory = require("./product/goodsAndCategory");
const SpecGroup = require("./product/specGroup");
const SpecOption = require("./product/specOption");
const Topping = require("./product/topping");
const ProductSpecRel = require("./product/productSpecRel");
const Notice = require("./system/notice");
const Store = require("./store/store");
const StorePhoto = require("./store/storePhoto");

// Coupon Models
const CouponTemplate = require("./coupon/couponTemplate");
const UserCoupon = require("./coupon/userCoupon");

// Checkin Models
const CheckinReward = require("./checkin/checkinReward");
const CheckinRecord = require("./checkin/checkinRecord");

// RBAC Models
const Role = require("./rbac/Role");
const Permission = require("./rbac/Permission");
const { UserRole, RolePermission } = require("./rbac/Mapping");
const UserStore = require("./user/UserStore");

// 用户和订单关联关系
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });

// 订单与订单项关联关系
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// 用户和地址关联关系
User.hasMany(Address, { foreignKey: "user_id" });
Address.belongsTo(User, { foreignKey: "user_id" });

// 用户和购物车关联关系
User.hasMany(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

// 购物车和商品关联关系
Goods.hasMany(Cart, { foreignKey: "goods_id" });
Cart.belongsTo(Goods, { foreignKey: "goods_id", as: "product" });

// 订单项和商品关联关系
OrderItem.belongsTo(Goods, {
  foreignKey: "goods_id",
  as: "product",
  sourceKey: "id",
});
Goods.hasMany(OrderItem, { foreignKey: "goods_id", targetKey: "id" });

// 地址和订单关系
Address.hasMany(Order, { foreignKey: "address_id" });
Order.belongsTo(Address, { foreignKey: "address_id" });

// 商品和分类关联关系 (多对多)
Goods.belongsToMany(Category, {
  through: GoodsCategory,
  foreignKey: "goods_id",
});
Category.belongsToMany(Goods, {
  through: GoodsCategory,
  foreignKey: "category_id",
});

// 规格组和规格选项关联关系
SpecGroup.hasMany(SpecOption, { foreignKey: "group_id" });
SpecOption.belongsTo(SpecGroup, { foreignKey: "group_id" });

// 商品和规格组关联关系 (多对多)
Goods.belongsToMany(SpecGroup, {
  through: ProductSpecRel,
  foreignKey: "product_id",
});
SpecGroup.belongsToMany(Goods, {
  through: ProductSpecRel,
  foreignKey: "group_id",
});

/**
 * RBAC 关联关系
 */
// 1. 用户与角色 (多对多)
User.belongsToMany(Role, { through: UserRole, foreignKey: "userId" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "roleId" });

// 2. 角色与权限 (多对多)
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permissionId" });

// 用户和门店关联关系
User.hasMany(Store, { foreignKey: "user_id" });
Store.belongsTo(User, { foreignKey: "user_id" });

// 用户所属门店(部门)关联关系 (多对多)
User.belongsToMany(Store, {
  through: UserStore,
  foreignKey: "userId",
  as: "departments",
});
Store.belongsToMany(User, {
  through: UserStore,
  foreignKey: "storeId",
});

// 门店和商品关联关系
Store.hasMany(Goods, { foreignKey: "store_id" });
Goods.belongsTo(Store, { foreignKey: "store_id" });

// 门店和照片关联关系
Store.hasMany(StorePhoto, { foreignKey: "store_id", as: "photos" });
StorePhoto.belongsTo(Store, { foreignKey: "store_id" });

/**
 * 优惠券关联关系
 */
// 优惠券模板和门店
CouponTemplate.belongsTo(Store, { foreignKey: "store_id" });
Store.hasMany(CouponTemplate, { foreignKey: "store_id" });

// 优惠券模板和创建者
CouponTemplate.belongsTo(User, { as: "creator", foreignKey: "created_by" });

// 优惠券模板和用户优惠券
CouponTemplate.hasMany(UserCoupon, { foreignKey: "template_id" });
UserCoupon.belongsTo(CouponTemplate, { as: "template", foreignKey: "template_id" });

// 用户和用户优惠券
User.hasMany(UserCoupon, { foreignKey: "user_id" });
UserCoupon.belongsTo(User, { as: "user", foreignKey: "user_id" });

// 订单和用户优惠券
Order.hasMany(UserCoupon, { foreignKey: "order_id" });
UserCoupon.belongsTo(Order, { foreignKey: "order_id" });

/**
 * 签到关联关系
 */
// 签到奖励配置和优惠券模板
CheckinReward.belongsTo(CouponTemplate, { foreignKey: "template_id" });
CouponTemplate.hasMany(CheckinReward, { foreignKey: "template_id" });

// 签到记录和用户
CheckinRecord.belongsTo(User, { as: "user", foreignKey: "user_id" });
User.hasMany(CheckinRecord, { foreignKey: "user_id" });

// 签到记录和用户优惠券
CheckinRecord.belongsTo(UserCoupon, { as: "coupon", foreignKey: "coupon_id" });

module.exports = {
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
};
